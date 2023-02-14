import { isEmpty } from "lodash";
import { Input, Form } from "antd";

// Проставляем данные в свои позиции
export const modData = (data: any[]) => {
  return data.map(({ body, ...item }) => ({
    ...item,
    key: item.id,
    message: isEmpty(body) ? item.message : body,
  }));
};

// Статус - находится ли запись под редактирование
export const isEditing = (rec: any, rowKey: string) => rec.key === rowKey;

export const mergeColumns = (data: ColumnsProps[], rowKey: string) => {
  return data.map((item) => {
    if (!item.isEdit) return item;

    return {
      ...item,
      onCell: (record: any) => ({
        record,
        dataIndex: item.dataIndex,
        title: item.title,
        key: item.key,
        isEdit: isEditing(record, rowKey),
      }),
    };
  });
};

export const editCell = ({
  isEdit,
  dataIndex,
  title,
  record,
  children,
  ...restProps
}: any) => {
  const input = <Input allowClear />;

  return (
    <td {...restProps}>
      {isEdit ? (
        <Form.Item
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `Пожалуйста введите что-то в поле ${title}`,
            },
          ]}
        >
          {input}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export const handleSearch = (filter: any[], data: any[], searchState: string) => {
  return filter = modData(data).filter((value) => {
    return (
      value.name.toLowerCase().includes(searchState.toLowerCase()) ||
      value.email.toLowerCase().includes(searchState.toLowerCase()) ||
      value.message.toLowerCase().includes(searchState.toLowerCase())
    )
  });
}