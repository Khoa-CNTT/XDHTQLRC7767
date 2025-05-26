import React, { useState, useEffect } from "react";
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
  const [loading, setLoading] = useState<boolean>(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [key, setKey] = useState<number>(0); // Thêm key để force re-render

  // Cập nhật fileList khi value thay đổi
  useEffect(() => {
    // Force re-render khi value thay đổi
    setKey((prevKey) => prevKey + 1);

    if (value) {
      setFileList([
        {
          uid: "-1",
          name: "image.png",
          status: "done",
          url: value,
        },
      ]);
    } else {
      // Reset fileList khi value rỗng
      setFileList([]);
    }
  }, [value]);

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
      <Upload {...uploadProps} key={key}>
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
