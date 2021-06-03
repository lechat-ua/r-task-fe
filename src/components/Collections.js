import React, { useEffect, useState } from 'react';
import { Button, Table, Space, message } from 'antd';
import { EditOutlined, CloseOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import EditCollectionsModal from './EditCollectionsModal';

const Collections = ({ store, contextsStore, entitiesStore }) => {

  useEffect(() => {
    store.fetchItems();
    contextsStore.fetchItems();
    entitiesStore.fetchItems();
  }, [store, contextsStore, entitiesStore])

  const [ isModalVisible, setModalVisible ] = useState(false);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Context',
      dataIndex: 'context',
      key: 'context',
    },
    {
      title: '',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button type="default" icon={<EditOutlined />} onClick={() => handleShowModal(record.id)} />
          <Button type="default" danger icon={<CloseOutlined />} onClick={() => handleRemoveItem(record.id)} />
        </Space>
      ),
    },
  ];

  const data = store.itemsAsArray.map(item => ({ ...item, key: item.id }));

  const handleCloseModal = () => {
    setModalVisible(false);
    store.clearSelectedItem();
  }

  const handleShowModal = id => {
    store.setSelectedItem(id);
    setModalVisible(true);
  }

  const handleAddNewCollection = () => {
    setModalVisible(true);
  }

  const handleShowItems = () => {
    console.log('total items', store.totalItems);
  }

  const handleRemoveItem = async (id) => {
    if (window.confirm('Remove item?')) {
      try {
        await store.removeItem(id);
        message.success('Item removed');
      } catch (e) {
        message.error(e.message);
      }
    }
  }

  const handleSubmitForm = async (data) => {
    try {
      await store.handleCreateOrUpdateItem(data);
      message.success('Item ok');
      store.clearSelectedItem();
      setModalVisible(false);
    } catch(e) {
      message.error(e.message);
    }
  }

  return <>
      <Space size="middle">
        <Button type="primary" onClick={handleShowItems}>Show items</Button>
        <Button type="primary" onClick={handleAddNewCollection}>Add new collection</Button>
      </Space>
      <br />
      <br />
      <Table
        columns={columns}
        dataSource={data}
        loading={store.loading}
      />
      <EditCollectionsModal
        visible={isModalVisible}
        handleCancel={handleCloseModal}
        handleOk={handleSubmitForm}
        loading={store.loading}
        initialData={store.selectedItem}
        contexts={contextsStore.itemsAsArray}
        entities={entitiesStore.itemsAsArray}
        collections={data}
      />
    </>
}

export default observer(Collections);