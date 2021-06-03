import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Modal, Button, Form, Input, Select } from 'antd';

const { Option } = Select;

const TYPE_COLLECTION = 'collection';
const TYPE_ENTITY = 'entity';

const EditEntityModal = ({ visible, handleCancel, handleOk, loading, initialData, entities, collections }) => {

  const [data, setData] = useState(initialData);
  const [elements, setElement] = useState([]);

  const dataTypes = [
    { id: TYPE_ENTITY, title: 'Entity' },
    { id: TYPE_COLLECTION, title: 'Collection' },
  ];

  const setElementsByType = type => {
    if (type === TYPE_COLLECTION) {
      setElement(collections.map(item => ({ id: item.id, name: item.name })));
    } else if (type === TYPE_ENTITY) {
      setElement(entities.map(item => ({ id: item.id, name: item.name })));
    } else {
      setElement([]);
    }
  }

  useEffect(() => {
    setData(initialData);
    setElementsByType(initialData && initialData.type ? initialData.type : undefined );
  }, [initialData]);

  const handleChange = (e, fieldName) => {
    if (['name2'].includes(fieldName)) {
      const splittedValue = e.split('|||');
      setData({ ...data, [fieldName]: splittedValue[1], ID: splittedValue[0] });
    } else if (['type'].includes(fieldName)) {
      setData({ ...data, [fieldName]: e, 'name2': '' });
      setElementsByType(e);
    } else {
      setData({ ...data, [fieldName]: e.target.value });
    }
  }

  const handleSubmitForm = e => {
    handleOk(data);
  }

  return (
    <Modal
      title="Edit entity/collection"
      visible={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="ok" onClick={handleSubmitForm} loading={loading}>
          Ok
        </Button>,
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>
      ]}
    >
      <Form>
        <Form.Item label="Name">
          <Input onChange={e => handleChange(e, 'name')} value={data.name || ''} />
        </Form.Item>
        <Form.Item label="Type">
          <Select onChange={e => handleChange(e, 'type')} value={data.type || ''}>
            {dataTypes.map(item => <Option value={item.id} key={item.id}>{item.title}</Option>)}
          </Select>
        </Form.Item>
        <Form.Item label="Element">
          <Select onChange={e => handleChange(e, 'name2')} value={data.name2 || ''}>
            {elements.map(item => <Option value={`${item.id}|||${item.name}`} key={item.id}>{item.name}</Option>)}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default observer(EditEntityModal);