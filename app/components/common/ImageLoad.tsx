import { Button, DropZone, Thumbnail, BlockStack, Text, Icon } from '@shopify/polaris';
import { NoteIcon, DeleteIcon, ShareIcon } from '@shopify/polaris-icons';
import { useState, useCallback } from 'react';

export function ImageLoad() {
  const [file, setFile] = useState<File>();

  const handleDropZoneDrop = useCallback(
    (_dropFiles: File[], acceptedFiles: File[], _rejectedFiles: File[]) =>
      setFile(acceptedFiles[0]),
    [],
  );

  const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

  const fileUpload = !file && <Icon source={ShareIcon}></Icon>;
  const uploadedFile = file && (
    <Thumbnail
      size="small"
      alt={file.name}
      source={
        validImageTypes.includes(file.type)
          ? window.URL.createObjectURL(file)
          : NoteIcon
      }
    />
  );

  return (
    <BlockStack>
      <Text as='span'>
        Image
      </Text>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: "40px" }}>
          <DropZone allowMultiple={false} onDrop={handleDropZoneDrop}>
            {uploadedFile}
            {fileUpload}
          </DropZone>
        </div>
        <Button onClick={() => handleDropZoneDrop([], [], [])} icon={DeleteIcon} >Reset image</Button>
      </div>
    </BlockStack>
  );
}