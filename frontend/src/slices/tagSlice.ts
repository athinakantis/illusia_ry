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
    // backend returns the *new* tag in res.data[0]
    return res.data[0];
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
    return res.data[0];
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
  ItemTagRelation,
  { itemId: string; tagId: string },
  { rejectValue: string }
>('tags/addTagToItem', async ({ itemId, tagId }, { rejectWithValue }) => {
  try {
    const res = await tagsApi.addTagToItem(itemId, tagId);
    return res.data[0];
  } catch (err) {
    const error = err as Error;
    return rejectWithValue(error.message ?? 'Failed to attach tag');
  }
});

// 6. Detach from an item
export const removeTagFromItem = createAsyncThunk<
  ItemTagRelation,
  { itemId: string; tagId: string },
  { rejectValue: string }
>('tags/removeTagFromItem', async ({ itemId, tagId }, { rejectWithValue }) => {
  try {
    const res = await tagsApi.removeTagFromItem(itemId, tagId);
    return res.data[0];
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
    builder.addCase(createTag.fulfilled, (s, a: PayloadAction<Tag>) => {
      s.tags.push(a.payload);
    });

    /* ---------------- updateTag ---------------- */
    builder.addCase(updateTag.fulfilled, (s, a: PayloadAction<Tag | undefined>) => {
      // Sometimes the backend returns an empty array → undefined payload.
      if (!a.payload) return;                              // nothing to update

      const idx = s.tags.findIndex((t) => t.tag_id === a.payload.tag_id);
      if (idx !== -1) {
        s.tags[idx] = a.payload;                           // replace existing
      } else {
        s.tags.push(a.payload);                            // or append if not cached yet
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