import React, { useState } from "react";
import { Upload, Button, message } from "antd";
import { UploadOutlined, LoadingOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import cloudinaryService from "../../utils/cloudinaryService";

interface CloudinaryUploadProps {
  onChange: (imageUrl: string) => void;
  value?: string;
  label?: string;
  className?: string;
}

const CloudinaryUpload: React.FC<CloudinaryUploadProps> = ({
  onChange,
  value,
  label = "Upload Image",
  className,
}) => {
  console.log("day nè:", value, onChange);
  const [loading, setLoading] = useState<boolean>(false);
  const [fileList, setFileList] = useState<UploadFile[]>(() => {
    if (value) {
      return [
        {
          uid: "-1",
          name: "image.png",
          status: "done",
          url: value,
        },
      ];
    }
    return [];
  });

  // We're using any here because Ant Design's types are complex
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    setLoading(true);

    try {
      // Ensure we're working with a File object
      const fileObject = file as File;
      const result = await cloudinaryService.uploadImage(fileObject);

      setFileList([
        {
          uid: result.public_id,
          name: fileObject.name,
          status: "done",
          url: result.secure_url,
        },
      ]);

      onChange(result.secure_url);
      onSuccess(result, file);
      message.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      onError(error instanceof Error ? error : new Error("Upload failed"));
      message.error("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  const uploadProps: UploadProps = {
    fileList,
    customRequest: handleUpload,
    onRemove: () => {
      setFileList([]);
      onChange("");
    },
    listType: "picture",
    maxCount: 1,
    accept: "image/*",
    showUploadList: {
      showPreviewIcon: true,
      showRemoveIcon: true,
    },
  };

  return (
    <div className={className}>
      <Upload {...uploadProps}>
        {loading ? (
          <Button icon={<LoadingOutlined />} disabled>
            Uploading...
          </Button>
        ) : (
          <Button icon={<UploadOutlined />}>{label}</Button>
        )}
      </Upload>
    </div>
  );
};

export default CloudinaryUpload;
