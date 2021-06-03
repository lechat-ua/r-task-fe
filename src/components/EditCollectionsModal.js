import { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, Row, Col, Checkbox, Space, Table, Select } from 'antd';
import { PlusOutlined, EditOutlined, CloseOutlined, TagOutlined, BlockOutlined } from '@ant-design/icons';
import { Observer, observer } from 'mobx-react-lite';
import { isEqual } from 'lodash';
import EditEntityModal from './EditEntityModal';

const { TextArea } = Input;
const { Option } = Select;

const EditCollectionsModal = ({ visible, handleCancel, handleOk, loading, initialData, collections, contexts, entities }) => {
  
  const [data, setData] = useState({});
  const [editEntityVisible, setEditEntityVisible] = useState(false);
  const [editEntityData, setEditEntityData] = useState({});

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Entity/Collection',
      dataIndex: 'name2',
      key: 'name2',
      render: (text, record) => (
        <Space size="middle">
          {record.type === 'entity' ? <TagOutlined /> : <BlockOutlined />}
          {text}
        </Space>
      )
    },
    {
      title: '',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button size="small" type="default" icon={<EditOutlined />} onClick={(e) => editCustomElement(e, record)} />
          <Button size="small" type="default" danger icon={<CloseOutlined />} onClick={e => removeCustomItem(e, record)} />
        </Space>
      ),
    },
  ];

  let entitiesData = [];
  if (data.structure && data.structure.custom) {
    entitiesData = data.structure.custom.map(item => ({ ...item, key: `${item.type}_${item.name2}_${item.ID}` }));
  }

  const handleChange = (e, fieldName) => {
    if (['context_id'].includes(fieldName)) {
      setData({ ...data, [fieldName]: e, context: contexts.find(item => item.id === e).name });
    } else {
      setData({ ...data, [fieldName]: e.target.value });
    }
  }
  const handleChangeDefaultFields = (e, fieldName) => {
    setData({ ...data, structure: { ...data.structure, [fieldName]: e.target.checked }});
  }

  const removeCustomItem = (e, item) => {
    setData({ ...data, structure: { ...data.structure, custom: data.structure.custom.filter(entity => !isEqual(item, entity)) }});
  }

  const editCustomElement = (e, item) => {
    setEditEntityData(item);
    setEditEntityVisible(true);
  }

  const handleCancelEditEntityModal = () => {
    setEditEntityVisible(false);
  }

  const handleSubmitEditEntityModal = entityData => {
    if (editEntityData && editEntityData.ID) {
      // update
      setData({
        ...data,
        structure: {
          ...data.structure,
          custom: data.structure.custom.map(item => {
            if (isEqual(item, editEntityData)) {
              return entityData;
            }
            return item;
          })
        }
      });
    } else {
      // add
      setData({ ...data, structure: { ...(data.structure || {}), custom: [ ...(data.structure ? (data.structure.custom || []) : []), entityData ]}});
    }
    setEditEntityData({});
    setEditEntityVisible(false);
  }

  const handleSubmit = () => {
    handleOk({ ...data });
  }

  return (
    <>
    <Modal
      title="Edit collection"
      visible={visible}
      onCancel={handleCancel}
      maskClosable={false}
      width={800}
      footer={[
        <Button key="status" onClick={() => {}}>
          Status
        </Button>,
        <Button key="ok" onClick={() => handleSubmit()} loading={loading}>
          Ok
        </Button>,
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>
      ]}
    >
      {/* <p>{JSON.stringify(data, '', 2)}</p> */}
      <Form
        layout="vertical"
      >
        <Row gutter={6}>
          <Col span={12}>
            <Form.Item
              label="Name"
              >
              <Input onChange={e => handleChange(e, 'name')} value={data.name || ''} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Context"
              >
                <Select onChange={e => handleChange(e, 'context_id')} value={data.context_id || ''}>
                  {contexts.map(item => <Option value={item.id} key={item.id}>{item.name}</Option>)}
                </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={6}>
          <Col span={6}>
            <p><b>Default fields</b></p>
            <Form.Item style={{ marginBottom: 0 }}>
              <Checkbox onChange={e => handleChangeDefaultFields(e, 'name')} checked={data.structure && data.structure.name} disabled={true}>Name</Checkbox>
            </Form.Item>
            <Form.Item style={{ marginBottom: 0 }}>
              <Checkbox onChange={e => handleChangeDefaultFields(e, 'code')} checked={data.structure && data.structure.code}>Code</Checkbox>
            </Form.Item>
            <Form.Item style={{ marginBottom: 0 }}>
              <Checkbox onChange={e => handleChangeDefaultFields(e, 'description')} checked={data.structure && data.structure.description}>Description</Checkbox>
            </Form.Item>
            <Form.Item style={{ marginBottom: 0 }}>
              <Checkbox onChange={e => handleChangeDefaultFields(e, 'ord')} checked={data.structure && data.structure.ord}>Sort</Checkbox>
            </Form.Item>
          </Col>
          <Col span={18}>
            <div>
              <Space>
                <b>Custom fields</b>
                <Button size="small" type="default" icon={<PlusOutlined />} onClick={e => editCustomElement(e, {})} />
              </Space>
            </div>
            <Observer>{() => 
            <Table
            columns={columns}
            dataSource={entitiesData}
            />
          }</Observer>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              label="Description"
            >
              <TextArea rows={3} onChange={e => handleChange(e, 'description')} value={data.description || ''} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
    <EditEntityModal
      visible={editEntityVisible}
      handleCancel={handleCancelEditEntityModal}
      handleOk={handleSubmitEditEntityModal}
      loading={false}
      initialData={editEntityData}
      entities={entities}
      collections={collections}
    />
    </>
  );
}

export default observer(EditCollectionsModal);