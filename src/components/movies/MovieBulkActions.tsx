import React from "react";
import { Button, Dropdown, Menu, Space } from "antd";
import {
  DownOutlined,
  DeleteOutlined,
  ExportOutlined,
  TagOutlined,
} from "@ant-design/icons";

interface MovieBulkActionsProps {
  selectedCount: number;
  onDelete: () => void;
  onExport?: () => void;
  onChangeStatus?: (status: number) => void;
  loading?: boolean;
}

const MovieBulkActions: React.FC<MovieBulkActionsProps> = ({
  selectedCount,
  onDelete,
  onExport,
  onChangeStatus,
  loading,
}) => {
  const statusMenu = (
    <Menu
      onClick={({ key }) => onChangeStatus && onChangeStatus(Number(key))}
      items={[
        {
          key: "1",
          label: "Đang chiếu",
        },
        {
          key: "0",
          label: "Sắp chiếu",
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
        loading={loading}
      >
        Xóa ({selectedCount})
      </Button>

      {onExport && (
        <Button icon={<ExportOutlined />} onClick={onExport} disabled={loading}>
          Xuất Excel
        </Button>
      )}

      {onChangeStatus && (
        <Dropdown overlay={statusMenu} disabled={loading}>
          <Button icon={<TagOutlined />} loading={loading}>
            Đổi trạng thái <DownOutlined />
          </Button>
        </Dropdown>
      )}
    </Space>
  );
};

export default MovieBulkActions;
