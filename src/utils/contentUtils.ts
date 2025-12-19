/**
 * Checks if HTML content (as produced by ReactQuill) is effectively empty.
 * Content is considered empty if it contains no text (other than whitespace/non-breaking spaces)
 * and no media elements (img, video, audio).
 */
export const isContentEmpty = (content: string | undefined): boolean => {
    if (!content) return true;

    // Simple string check for common empty Quill patterns before using DOMParser
    const plain = content.replace(/<[^>]*>/g, '').replace(/&nbsp;|\u00A0/g, ' ').trim();
    if (plain.length > 0) return false;

    // If plaintext is empty, check for media tags
    // Using a regex as a lightweight alternative to DOMParser for simple tags
    const hasMedia = /<(img|video|audio|iframe)[^>]*>/.test(content);
    return !hasMedia;
};
