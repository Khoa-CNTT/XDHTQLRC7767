import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  message,
  Typography,
  Table,
  Popconfirm,
  Tag,
  Modal,
  Space,
} from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  addRoomRequest,
  updateRoomRequest,
  getAdminRoomListRequest,
  deleteRoomRequest,
  Room,
} from "../../redux/slices/room.slice";
import { getCinemaListRequest } from "../../redux/slices/cinemaSlice";
import { RootState } from "../../redux/store";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const { Title } = Typography;
const { Option } = Select;

const PageHeader = styled.div`
  margin-bottom: 24px;
`;

const StyledCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const CinemaRoomManagement: React.FC = () => {
  useDocumentTitle("Quản lý phòng chiếu");
  const [roomForm] = Form.useForm();

  const [isRoomModalVisible, setIsRoomModalVisible] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [currentDeletingId, setCurrentDeletingId] = useState<number | null>(
    null
  );

  const dispatch = useDispatch();
  const { data: roomsFromRedux, loading: roomsLoading } = useSelector(
    (state: RootState) => state.room.adminRoomList
  );
  const { data: cinemasFromRedux, loading: cinemasLoading } = useSelector(
    (state: RootState) => state.cinema.cinemaList
  );

  // Get loading states for room operations
  const { loading: addRoomLoading, success: addRoomSuccess } = useSelector(
    (state: RootState) => state.room.adminRoomAdd
  );
  const { loading: updateRoomLoading, success: updateRoomSuccess } =
    useSelector((state: RootState) => state.room.adminRoomUpdate);
  const { loading: deleteRoomLoading } = useSelector(
    (state: RootState) => state.room.adminRoomDelete
  );

  // Reset deleting ID when delete operation completes
  const { success: deleteRoomSuccess } = useSelector(
    (state: RootState) => state.room.adminRoomDelete
  );

  useEffect(() => {
    if (deleteRoomSuccess) {
      setCurrentDeletingId(null);
    }
  }, [deleteRoomSuccess]);

  // Fetch rooms and cinemas on component mount
  useEffect(() => {
    dispatch(getAdminRoomListRequest(undefined));
    dispatch(getCinemaListRequest());
  }, [dispatch]);

  // Close modal and reset form on success
  useEffect(() => {
    if (addRoomSuccess || updateRoomSuccess) {
      setIsRoomModalVisible(false);
      roomForm.resetFields();
    }
  }, [addRoomSuccess, updateRoomSuccess, roomForm]);

  const showRoomModal = (room: Room | null = null) => {
    setCurrentRoom(room);
    setIsRoomModalVisible(true);
    if (room) {
      roomForm.setFieldsValue(room);
    } else {
      roomForm.resetFields();
    }
  };

  const handleRoomSubmit = (values: any) => {
    if (currentRoom) {
      dispatch(
        updateRoomRequest({
          id: currentRoom.id,
          ...values,
        })
      );
    } else {
      dispatch(addRoomRequest(values));
    }
  };

  const handleDeleteRoom = (id: number) => {
    setCurrentDeletingId(id);
    dispatch(deleteRoomRequest(id));
  };

  const handleToggleRoomStatus = (id: number, status: string) => {
    dispatch(
      updateRoomRequest({
        id,
        status: status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
      })
    );
  };

  const handleCancel = () => {
    setIsRoomModalVisible(false);
    roomForm.resetFields();
  };

  const roomColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên phòng",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Rạp",
      dataIndex: "cinemaId",
      key: "cinemaId",
      render: (cinemaId: number) => {
        const cinema = cinemasFromRedux?.find((c) => c.id === cinemaId);
        return cinema ? cinema.name : "Không xác định";
      },
    },
    {
      title: "Sức chứa",
      dataIndex: "capacity",
      key: "capacity",
    },
    {
      title: "Loại phòng",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "ACTIVE" ? "green" : "red"}>
          {status === "ACTIVE" ? "Hoạt động" : "Ngừng hoạt động"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: Room) => (
        <Space size="small">
          <Button
            icon={<EditOutlined />}
            onClick={() => showRoomModal(record)}
            type="link"
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa phòng này?"
            onConfirm={() => handleDeleteRoom(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              icon={<DeleteOutlined />}
              danger
              type="link"
              loading={currentDeletingId === record.id && deleteRoomLoading}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <PageHeader>
        <Title level={2}>Quản lý phòng chiếu</Title>
      </PageHeader>

      <StyledCard
        title="Danh sách phòng chiếu"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showRoomModal()}
          >
            Thêm phòng chiếu
          </Button>
        }
      >
        <Table
          columns={roomColumns}
          dataSource={roomsFromRedux}
          rowKey="id"
          loading={roomsLoading}
          pagination={{ pageSize: 10 }}
        />
      </StyledCard>

      <Modal
        title={currentRoom ? "Chỉnh sửa phòng chiếu" : "Thêm phòng chiếu mới"}
        open={isRoomModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={roomForm}
          layout="vertical"
          onFinish={handleRoomSubmit}
          initialValues={{ status: "ACTIVE" }}
        >
          <Form.Item
            name="name"
            label="Tên phòng"
            rules={[{ required: true, message: "Vui lòng nhập tên phòng!" }]}
          >
            <Input placeholder="Nhập tên phòng" />
          </Form.Item>

          <Form.Item
            name="cinemaId"
            label="Rạp"
            rules={[{ required: true, message: "Vui lòng chọn rạp!" }]}
          >
            <Select placeholder="Chọn rạp" loading={cinemasLoading}>
              {cinemasFromRedux?.map((cinema) => (
                <Option key={cinema.id} value={cinema.id}>
                  {cinema.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="capacity"
            label="Sức chứa"
            rules={[{ required: true, message: "Vui lòng nhập sức chứa!" }]}
          >
            <Input type="number" placeholder="Nhập sức chứa" />
          </Form.Item>

          <Form.Item
            name="type"
            label="Loại phòng"
            rules={[{ required: true, message: "Vui lòng chọn loại phòng!" }]}
          >
            <Select placeholder="Chọn loại phòng">
              <Option value="2D">2D</Option>
              <Option value="3D">3D</Option>
              <Option value="4DX">4DX</Option>
              <Option value="IMAX">IMAX</Option>
              <Option value="VIP">VIP</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Option value="ACTIVE">Hoạt động</Option>
              <Option value="INACTIVE">Ngừng hoạt động</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={addRoomLoading || updateRoomLoading}
              style={{ marginRight: 8 }}
            >
              {currentRoom ? "Cập nhật" : "Thêm mới"}
            </Button>
            <Button onClick={handleCancel}>Hủy</Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CinemaRoomManagement;
