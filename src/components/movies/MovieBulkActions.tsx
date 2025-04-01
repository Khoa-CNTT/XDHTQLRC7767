import React from "react";
import { Button, Dropdown, Menu, Space } from "antd";
import { DownOutlined, DeleteOutlined, ExportOutlined, TagOutlined } from "@ant-design/icons";

interface MovieBulkActionsProps {
  selectedCount: number;
  onDelete: () => void;
  onExport?: () => void;
  onChangeStatus?: (status: string) => void;
}

const MovieBulkActions: React.FC<MovieBulkActionsProps> = ({
  selectedCount,
  onDelete,
  onExport,
  onChangeStatus,
}) => {
  const statusMenu = (
    <Menu
      onClick={({ key }) => onChangeStatus && onChangeStatus(key as string)}
      items={[
        {
          key: "Đang chiếu",
          label: "Đang chiếu",
        },
        {
          key: "Sắp chiếu",
          label: "Sắp chiếu",
        },
        {
          key: "Đã chiếu",
          label: "Đã chiếu",
        },
      ]}
    />
  );

  return (
    <Space size="small">
      <Button
        danger
        icon={<DeleteOutlined />}
        onClick={onDelete}
      >
        Xóa ({selectedCount})
      </Button>
      
      {onExport && (
        <Button icon={<ExportOutlined />} onClick={onExport}>
          Xuất Excel
        </Button>
      )}
      
      {onChangeStatus && (
        <Dropdown overlay={statusMenu}>
          <Button icon={<TagOutlined />}>
            Đổi trạng thái <DownOutlined />
          </Button>
        </Dropdown>
      )}
    </Space>
  );
};

export default MovieBulkActions; 