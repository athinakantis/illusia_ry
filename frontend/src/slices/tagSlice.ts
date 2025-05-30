// src/slices/tagSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { tagsApi } from '../api/tags';
import { RootState } from '../store/store';
import { ItemState } from '../types/types';

/* ------------------------------------------------------------------ */
/* Types & helpers                                                    */
/* ------------------------------------------------------------------ */

// A single tag row coming back from the backend
type Tag = ItemState['tags'][number];

// The attach/detach endpoints return junction rows; we don’t need to
// keep them in this slice, so we just type the payload as `unknown`.
type ItemTagRelation = ItemState['item_tags'][number];

// Extended type to include tag_name for itemsSlice
export type ItemTagRelationWithTagName = ItemTagRelation & { tag_name: string };

/* ------------------------------------------------------------------ */
/* Initial state                                                      */
/* ------------------------------------------------------------------ */

interface TagSliceState {
  tags: Tag[];
  loading: boolean;
  error: string | null;
}

const initialState: TagSliceState = {
  tags: [],
  loading: false,
  error: null,
};

/* ------------------------------------------------------------------ */
/* Thunks                                                             */
/* ------------------------------------------------------------------ */

// 1. Fetch every tag once (startup or refresh)
export const fetchAllTags = createAsyncThunk<
  Tag[],
  void,
  { rejectValue: string }
>('tags/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await tagsApi.getAllTags();
    return res.data;
  } catch (err) {
    const error = err as Error
    return rejectWithValue(error.message ?? 'Failed to fetch tags');
  }
});

// 2. Create
export const createTag = createAsyncThunk<
  Tag,
  { tag_name: string; description?: string },
  { rejectValue: string }
>('tags/createTag', async (payload, { rejectWithValue }) => {
  try {
    const res = await tagsApi.createTag(payload);
 
    // The API may return { data: [...]} *or* { data: {...} }.
    const created = Array.isArray(res.data) ? res.data[0] : res.data;

    return created as Tag;
  } catch (err) {
    const error = err as Error;
    return rejectWithValue(error.message ?? 'Failed to create tag');
  }
});

// 3. Update
export const updateTag = createAsyncThunk<
  Tag,
  { tagId: string; tag_name: string; description?: string },
  { rejectValue: string }
>('tags/updateTag', async ({ tagId, ...rest }, { rejectWithValue }) => {
  try {
    const res = await tagsApi.updateTag(tagId, rest);

    const updated = Array.isArray(res.data) ? res.data[0] : res.data;

    return updated as Tag;
  } catch (err) {
    const error = err as Error;
    return rejectWithValue(error.message ?? 'Failed to update tag');
  }
});

// 4. Delete
export const deleteTag = createAsyncThunk<
  string,            // return deleted tagId so we can filter it out
  { tagId: string },
  { rejectValue: string }
>('tags/deleteTag', async ({ tagId }, { rejectWithValue }) => {
  try {
    await tagsApi.deleteTag(tagId);
    return tagId;
  } catch (err) {
    const error = err as Error;
    return rejectWithValue(error.message ?? 'Failed to delete tag');
  }
});

// 5. Attach to an item
export const addTagToItem = createAsyncThunk<
  ItemTagRelationWithTagName,
  { itemId: string; tagId: string },
  { rejectValue: string; state: RootState }
>('tags/addTagToItem', async ({ itemId, tagId }, { rejectWithValue, getState }) => {
  try {
    const res = await tagsApi.addTagToItem(itemId, tagId);
    const relData = Array.isArray(res.data) ? res.data[0] : res.data;

    if (!relData || !relData.tag_id) {
      return rejectWithValue('Failed to attach tag: Invalid response data from API.');
    }

    const state = getState();
    const tag = state.tags.tags.find(t => t.tag_id === relData.tag_id);

    if (!tag || !tag.tag_name) {
      console.warn(`Tag name not found for tagId: ${relData.tag_id} during addTagToItem. Proceeding without tag_name.`);
      // To strictly enforce tag_name, you could rejectWithValue here:
      // return rejectWithValue(`Tag name not found for tagId: ${relData.tag_id}`);
      // For now, we'll allow it to proceed, itemsSlice will need to handle potentially missing tag_name if this path is taken.
      // However, the type ItemTagRelationWithTagName requires tag_name.
      // Let's assume for now that the API and state are consistent enough that tag_name is found.
      // If not, the line below would be problematic.
      // A more robust solution might involve fetching the tag if not found, or having a default.
      // For this implementation, we'll rely on it being present.
      return rejectWithValue(`Tag name not found for tagId: ${relData.tag_id}. This should not happen.`);
    }

    return { ...relData, tag_name: tag.tag_name } as ItemTagRelationWithTagName;
  } catch (err) {
    const error = err as Error;
    return rejectWithValue(error.message ?? 'Failed to attach tag');
  }
});

// 6. Detach from an item
export const removeTagFromItem = createAsyncThunk<
  ItemTagRelationWithTagName,
  { itemId: string; tagId: string },
  { rejectValue: string; state: RootState }
>('tags/removeTagFromItem', async ({ itemId, tagId }, { rejectWithValue, getState }) => {
  try {
    const res = await tagsApi.removeTagFromItem(itemId, tagId);

    let baseRel: Omit<ItemTagRelation, 'created_at'> & { created_at?: string };

    if (Array.isArray(res.data) && res.data.length > 0 && res.data[0].tag_id) {
      baseRel = res.data[0];
    } else {
      // Fabricate if API returns empty or insufficient data
      baseRel = { item_id: itemId, tag_id: tagId };
    }
    
    const state = getState();
    const tag = state.tags.tags.find(t => t.tag_id === baseRel.tag_id);

    if (!tag || !tag.tag_name) {
      console.warn(`Tag name not found for tagId: ${baseRel.tag_id} during removeTagFromItem. Proceeding without tag_name for itemsSlice update.`);
      // Similar to addTagToItem, strict handling would reject.
      // For now, assuming consistency.
      return rejectWithValue(`Tag name not found for tagId: ${baseRel.tag_id}. This should not happen.`);
    }
    
    // Ensure created_at is present, even if undefined, to match ItemTagRelation
    const finalRel = {
      item_id: baseRel.item_id,
      tag_id: baseRel.tag_id,
      created_at: baseRel.created_at || new Date().toISOString(), // Fallback for created_at if missing
      tag_name: tag.tag_name,
    };

    return finalRel as ItemTagRelationWithTagName;
  } catch (err) {
    const error = err as Error;
    return rejectWithValue(error.message ?? 'Failed to detach tag');
  }
});

/* ------------------------------------------------------------------ */
/* Slice                                                              */
/* ------------------------------------------------------------------ */

const tagSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    /* ---------------- fetchAllTags ---------------- */
    builder.addCase(fetchAllTags.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    builder.addCase(
      fetchAllTags.fulfilled,
      (s, a: PayloadAction<Tag[]>) => {
        s.tags = a.payload;
        s.loading = false;
      }
    );
    builder.addCase(fetchAllTags.rejected, (s, a) => {
      s.loading = false;
      s.error = a.payload ?? 'Unknown error';
    });

    /* ---------------- createTag ---------------- */
    builder.addCase(createTag.fulfilled, (s, a: PayloadAction<Tag | undefined>) => {
      /**
       * Supabase will only return the inserted row if the query uses
       * `.select()`.  When that isn’t the case `a.payload` will be `undefined`.
       * We must guard against that to avoid pushing an `undefined` value,
       * which breaks `Array.map` calls in the UI.
       */
      if (a.payload) {
        s.tags.push(a.payload);
      } else {
        // Optional: log a warning to help with backend debugging
        console.warn(
          '[tagSlice] createTag.fulfilled received undefined payload – ' +
          'did you forget to add `.select()` to the Supabase insert query?'
        );
      }
    });

    /* ---------------- updateTag ---------------- */
    builder.addCase(updateTag.fulfilled, (s, a) => {
      /**
       * Supabase’s `update()` often returns an empty array unless you chain
       * `.select()` on the query.  If that happens we still want to reflect the
       * change in our client cache, otherwise the UI won’t update until the next
       * full reload.
       *
       * ❶ If the backend DID return the updated row, use it verbatim.  
       * ❷ Otherwise fall back to the data we just sent (`a.meta.arg`).
       */
      const updated = a.payload ?? {
        // a.meta.arg has the *input* that was sent to the thunk
        tag_id: a.meta.arg.tagId,
        tag_name: a.meta.arg.tag_name,
        description:
          'description' in a.meta.arg ? a.meta.arg.description : undefined,
      } as Tag;

      const idx = s.tags.findIndex((t) => t.tag_id === updated.tag_id);
      if (idx !== -1) {
        s.tags[idx] = { ...s.tags[idx], ...updated }; // merge to preserve other fields
      } else {
        s.tags.push(updated);
      }
    });

    /* ---------------- deleteTag ---------------- */
    builder.addCase(deleteTag.fulfilled, (s, a: PayloadAction<string>) => {
      s.tags = s.tags.filter((t) => t.tag_id !== a.payload);
    });

    /* ------------- attach/detach ------------- */
    builder.addCase(addTagToItem.rejected, (s, a) => {
      s.error = a.payload ?? 'Failed to attach tag';
    });
    builder.addCase(removeTagFromItem.rejected, (s, a) => {
      s.error = a.payload ?? 'Failed to detach tag';
    });
    // (No state change needed on fulfilled – ItemsSlice handles junctions)
  },
});

export default tagSlice.reducer;

/* ------------------------------------------------------------------ */
/* Selectors                                                          */
/* ------------------------------------------------------------------ */

export const selectAllTags     = (state: RootState) => state.tags.tags;
export const selectTagsLoading = (state: RootState) => state.tags.loading;
export const selectTagsError   = (state: RootState) => state.tags.error;
