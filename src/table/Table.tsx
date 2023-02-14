import { 
  ChangeEvent, 
  FC, 
  useEffect, 
  useState 
} from "react";

import ky from "ky";

import { 
  Button, 
  Form, 
  Input, 
  Popconfirm, 
  Space, 
  Table 
} from "antd";

import {
  editCell,
  handleSearch,
  isEditing,
  mergeColumns,
  modData,
} from "./scripts";

const TableComponent: FC = () => {
  const [loading, setLoading] = useState<boolean>(false),
    [data, setData] = useState<PostsProps[]>([]),
    [editRowWithKey, setEditRowWithKey] = useState<string>(""),
    [sorted, setSorted] = useState<SortedProps>({} as SortedProps),
    [searchText, setSearchText] = useState<string>("");

  let [filteredData] = useState<any[]>([]);

  const [form] = Form.useForm();

  // Функция для стрима
  const fetchingData = async () => {
    setLoading(true);

    const response: Array<PostsProps> = await ky
      .get("https://jsonplaceholder.typicode.com/comments")
      .json();

    setData(response);

    setLoading(false);
  };

  // Стрим
  useEffect(() => {
    fetchingData();
  }, []);

  const handleDeleteRecord = (record: any) => {
    const source = [...modData(data)];
    const filtered = source.filter((item) => item.id !== record.id);
    setData(filtered);
  };

  // Функция для отмены изменений
  const cancelChangeRecord = () => {
    setEditRowWithKey("");
  };

  // Функция для сохранения изменений
  const saveChangeRecord = async (record: number): Promise<void> => {
    console.log(record);
    try {
      const row = await form.validateFields();
      const _data = [...modData(data)];
      const idx = _data.findIndex((item) => record === item.key);

      if (idx > -1) {
        const item = _data[idx];
        _data.splice(idx, 1, { ...item, ...row });
        setData(_data);
        setEditRowWithKey("");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Функция для изменения value
  const editRecord = (record: any): void => {
    console.log(record);
    form.setFieldsValue({
      name: "",
      email: "",
      message: "",
      ...record,
    });

    setEditRowWithKey(record.key);
  };

  const handleTableChange = (...sorter: any): void => {
    const { order, field } = sorter[2];
    setSorted({ columnKey: field, order });
  };

  const resetSorted = () => {
    setSorted({ columnKey: "", order: "" });
    setSearchText("");
  };

  // Стримовые колонны
  const columns: Array<ColumnsProps> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      isEdit: true,
      sorter: (a, b) => a.name.length - b.name.length,
      sortOrder: sorted.columnKey === "name" && sorted.order,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      isEdit: true,
      sorter: (a, b) => a.email.length - b.email.length,
      sortOrder: sorted.columnKey === "email" && sorted.order,
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      isEdit: true,
      sorter: (a, b) => a.message.length - b.message.length,
      sortOrder: sorted.columnKey === "message" && sorted.order,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_: any, record: any) => {
        const status = isEditing(record, editRowWithKey);

        return modData.length >= 1 ? (
          <Space>
            <Popconfirm
              title="Вы точно хотите удалить запись?"
              onConfirm={() => handleDeleteRecord(record)}
            >
              <Button danger type="primary" disabled={status}>
                Удалить
              </Button>
            </Popconfirm>
            {status ? (
              <span>
                <Space size="small">
                  <Button
                    onClick={() => saveChangeRecord(record.key)}
                    type="primary"
                    style={{ marginRight: 8 }}
                  >
                    Сохранить
                  </Button>
                  <Popconfirm
                    title="Хотите отменить изменения?"
                    onConfirm={cancelChangeRecord}
                  >
                    <Button>Отменить</Button>
                  </Popconfirm>
                </Space>
              </span>
            ) : (
              <Button type="primary" onClick={() => editRecord(record)}>
                Редактировать
              </Button>
            )}
          </Space>
        ) : null;
      },
    },
  ];

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);

    if (e.target.value === "") return fetchingData();
  };

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Поиск"
          onChange={handleSearchChange}
          type="text"
          allowClear
        />
        <Button
          type="primary"
          onClick={() => setData(handleSearch(filteredData, data, searchText))}
        >
          Найти
        </Button>
        <Button onClick={resetSorted}>Сбросить сортировку</Button>
      </Space>
      <Form form={form} component={false}>
        <Table
          columns={mergeColumns(columns, editRowWithKey)}
          dataSource={
            filteredData && filteredData.length ? filteredData : modData(data)
          }
          components={{
            body: {
              cell: editCell,
            },
          }}
          bordered
          loading={loading}
          onChange={handleTableChange}
        />
      </Form>
    </>
  );
};

export default TableComponent;
