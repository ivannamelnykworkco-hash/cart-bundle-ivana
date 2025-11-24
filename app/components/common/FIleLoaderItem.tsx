import { Button, DropZone, InlineStack, Thumbnail } from "@shopify/polaris";
import { ImageIcon } from "@shopify/polaris-icons";
import { useCallback, useState } from "react";

export function FileLoaderItem() {

  const [file, setFile] = useState<File>();
  const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

  const fileUpload = !file && <DropZone.FileUpload />;
  const uploadedFile = file && (
    <Thumbnail
      size="extraSmall"
      alt={file.name}
      source={
        validImageTypes.includes(file.type)
          ? window.URL.createObjectURL(file)
          : ImageIcon
      }
    />
  );

  const handleDrop = useCallback(
    (_dropFiles: File[], acceptedFiles: File[], _rejectedFiles: File[]) =>
      setFile(acceptedFiles[0]),
    [],
  );

  const [openFileDialog, setOpenFileDialog] = useState(false);

  const toggleOpenFileDialog = useCallback(
    () => setOpenFileDialog((openFileDialog) => !openFileDialog),
    [],
  );

  return (
    <InlineStack>
      <DropZone
        openFileDialog={openFileDialog}
        onFileDialogClose={toggleOpenFileDialog}
        onDrop={handleDrop}
      >
        {uploadedFile}
      </DropZone>,
      <Button onClick={toggleOpenFileDialog}> Choose Image</Button>
    </InlineStack>
  );
}
