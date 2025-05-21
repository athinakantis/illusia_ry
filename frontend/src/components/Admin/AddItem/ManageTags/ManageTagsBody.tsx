/* ------------------------------------------------------------ */
/* Dialog body                                                  */
/* ------------------------------------------------------------ */

import { Close, Delete, Edit, Save } from "@mui/icons-material";
import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    IconButton,
    List,
    ListItem,
    ListItemText,
    TextField,
    Tooltip,
} from "@mui/material";
import {
    addTagToItem,
    createTag,
    deleteTag,
    fetchAllTags,
    removeTagFromItem,
    selectAllTags,
    selectTagsLoading,
    updateTag,
} from "../../../../slices/tagSlice";
import { FC, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { selectTagIdsForItem, fetchAllItemTags } from "../../../../slices/itemsSlice";
import { Trans, useTranslation } from "react-i18next";

interface BodyProps {
    itemId?: string;
}

const ManageTagsBody: FC<BodyProps> = ({ itemId }) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    /* ---------------- state & selectors ---------------- */
    const tags = useAppSelector(selectAllTags);
    const loading = useAppSelector(selectTagsLoading);
    const attachedIds = useAppSelector(
        itemId ? selectTagIdsForItem(itemId) : () => [],
    );

    const [newName, setNewName] = useState("");
    const [editId, setEditId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");

    /* ---------------- initial fetch ---------------- */
    useEffect(() => {
        if (tags.length === 0 && !loading) dispatch(fetchAllTags());
    }, [dispatch, tags.length, loading]);

    useEffect(() => {
      dispatch(fetchAllItemTags());
    }, [dispatch]);

    /* ---------------- handlers ---------------- */
    const handleCreate = () => {
        if (!newName.trim()) return;
        dispatch(createTag({ tag_name: newName.trim() }));
        setNewName("");
    };

    const handleRename = (tagId: string) => {
        if (
            !editName.trim() ||
            editName.trim() === tags.find((t) =>
                    t.tag_id === tagId
                )?.tag_name
        ) {
            return;
        }
        dispatch(updateTag({ tagId, tag_name: editName.trim() }));
        setEditId(null);
    };

    const handleDelete = (tagId: string) => {
        if (
            confirm(
                t("admin.add_product.manage_tag_body.confirmDelete", {
                    defaultValue: "Are you sure you want to delete this tag?",
                }),
            )
        ) {
            dispatch(deleteTag({ tagId }));
        }
    };

    const toggleAttach = (tagId: string, attach: boolean) => {
        if (!itemId) return;
        if (attach) dispatch(addTagToItem({ itemId, tagId }));
        else dispatch(removeTagFromItem({ itemId, tagId }));
    };

    /* ---------------- render helpers ---------------- */
    const renderActions = (tagId: string) => (
        <>
            {itemId && (
                <Checkbox
                    edge="start"
                    size="small"
                    checked={attachedIds.includes(tagId)}
                    onChange={(e) => toggleAttach(tagId, e.target.checked)}
                    sx={{ mr: 1 }}
                />
            )}
            {editId === tagId
                ? (
                    <>
                        <IconButton
                            size="small"
                            onClick={() => handleRename(tagId)}
                            sx={{ mr: 0.5 }}
                        >
                            <Save fontSize="small" />
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={() => setEditId(null)}
                            sx={{ mr: 0.5 }}
                        >
                            <Close fontSize="small" />
                        </IconButton>
                    </>
                )
                : (
                    <>
                        <IconButton
                            size="small"
                            onClick={() => {
                                setEditId(tagId);
                                setEditName(
                                    tags.find((t) => t.tag_id === tagId)
                                        ?.tag_name ?? "",
                                );
                            }}
                            sx={{ mr: 0.5 }}
                        >
                            <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={() => handleDelete(tagId)}
                            sx={{ mr: 0.5 }}
                        >
                            <Delete fontSize="small" />
                        </IconButton>
                    </>
                )}
        </>
    );

    return (
        <Box>
            {/* create new ---------------------------------------------------- */}
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                <TextField
                    label={t("admin.add_product.manage_tag_body.newTag", {
                        defaultValue: "New tag",
                    })}
                    size="small"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    fullWidth
                />
                <Button
                    variant="contained"
                    onClick={handleCreate}
                    disabled={!newName.trim()}
                >
                    {t("admin.add_product.manage_tag_body.add", { defaultValue: "Add" })}
                </Button>
                {loading && (
                    <CircularProgress size={24} sx={{ alignSelf: "center" }} />
                )}
            </Box>

            {/* attach mode hint ------------------------------------------------ */}
            {itemId && (
                <Box sx={{ mb: 1, fontSize: 12, opacity: 0.7 }}>
                    {t('admin.add_product.manage_tag_body.attachHint', {
                        defaultValue:
                            'Tip: Tick the check-boxes to attach or detach tags for this item.',
                    })}
                </Box>
            )}

            {/* list ---------------------------------------------------------- */}
            <List dense>
                {tags.map((tag) => (
                    <ListItem
                        key={tag.tag_id}
                        disablePadding
                        secondaryAction={renderActions(tag.tag_id)}
                    >
                        {editId === tag.tag_id
                            ? (
                                <TextField
                                    size="small"
                                    value={editName}
                                    onChange={(e) =>
                                        setEditName(e.target.value)}
                                    autoFocus
                                />
                            )
                            : <ListItemText primary={tag.tag_name} />}
                    </ListItem>
                ))}
            </List>

            {!itemId && (
                <Tooltip
                    title={
                        <Trans
                            i18nKey="admin.add_product.manage_tag_body.checkBoxesTip">
                                Check boxes are only available in the Item editor.
                            </Trans>
                    }
                >
                    <span style={{ fontSize: 12, opacity: 0.7 }}>
                        {t("admin.add_product.manage_tag_body.checkBoxesTip", {
                            defaultValue:
                                "Check boxes are only available in the Item editor.",
                        })}
                    </span>
                </Tooltip>
            )}
        </Box>
    );
};

export default ManageTagsBody;
