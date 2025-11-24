import {
  Thumbnail,
  DropZone,
  Button,
  InlineStack,
} from '@shopify/polaris';
import { NoteIcon } from '@shopify/polaris-icons';
import React, { useState, useCallback, useRef, useEffect } from 'react';

export function ImageUploader({ value, onChange }) {
  const [file, setFile] = useState<File | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

  // Sync with parent when value changes
  useEffect(() => {
    if (value) setFile(value);
  }, [value]);

  const updateFile = (newFile: File) => {
    setFile(newFile);
    onChange?.(newFile); // send file to parent
  };

  const handleDrop = useCallback((dropFiles: File[]) => {
    if (dropFiles.length > 0) updateFile(dropFiles[0]);
  }, []);

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (selected) updateFile(selected);
  };

  const openFileDialog = () => fileInputRef.current?.click();

  const thumbnailSource =
    file && validImageTypes.includes(file.type)
      ? window.URL.createObjectURL(file)
      : NoteIcon;

  return (
    <InlineStack align="start" gap="200">
      <DropZone
        onDrop={handleDrop}
        accept="image/*"
        type="image"
        allowMultiple={false}
      >
        <Thumbnail
          size="small"
          alt={file ? file.name : 'placeholder'}
          source={thumbnailSource}
        />
      </DropZone>

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileInputChange}
      />

      {/* Upload button */}
      <Button onClick={openFileDialog}>Choose Image</Button>
    </InlineStack>
  );
}