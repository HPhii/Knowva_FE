import React, { useState, useEffect, useRef } from 'react';
import { X, Search, UserPlus, Check, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { message, Modal, Button, Input, Select } from 'antd';
import useDebounce from '../hooks/useDebounce';
import api from '../config/axios';

const InviteModal = ({ 
  isOpen, 
  onClose, 
  entityId, 
  entityType, // 'quiz' or 'flashcard'
  onInviteSuccess 
}) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [permission, setPermission] = useState('VIEW');
  const [invitedUsers, setInvitedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchContainerRef = useRef(null);
  const inputRef = useRef(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Fetch invited users when modal opens
  useEffect(() => {
    if (isOpen) {
      // Temporarily disabled until backend API is implemented
      // fetchInvitedUsers();
    }
  }, [isOpen, entityId]);

  // Search users with debounce
  useEffect(() => {
    if (debouncedSearchTerm.trim() === '') {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    searchUsers();
  }, [debouncedSearchTerm]);

  // Handle click outside to close search results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchUsers = async () => {
    try {
      setSearchLoading(true);
      const { data } = await api.get('/search/accounts', {
        params: { keyword: debouncedSearchTerm, page: 0, size: 10 }
      });
      setSearchResults(data.accounts || []);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Search users failed:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const fetchInvitedUsers = async () => {
    try {
      setLoading(true);
      const endpoint = entityType === 'quiz' 
        ? `/quiz-sets/${entityId}/invitations` 
        : `/flashcard-sets/${entityId}/invitations`;
      const { data } = await api.get(endpoint);
      setInvitedUsers(data || []);
    } catch (error) {
      console.error('Fetch invited users failed:', error);
      setInvitedUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setSearchTerm(user.username || user.email);
    setShowSearchResults(false);
  };

  const handleSendInvitation = async () => {
    if (!selectedUser) {
      message.warning('Vui lòng chọn người dùng');
      return;
    }

    try {
      setLoading(true);
      const endpoint = entityType === 'quiz' 
        ? `/quiz-sets/${entityId}/invite` 
        : `/flashcard-sets/${entityId}/invite`;
      
      const requestBody = {
        userId: selectedUser.id || selectedUser.accountId,
        permission: permission
      };

      await api.post(endpoint, requestBody);
      
      // Show success message
      message.success('Gửi lời mời thành công!');
      
      // Refresh invited users list - temporarily disabled
      // await fetchInvitedUsers();
      
      // Reset form
      setSelectedUser(null);
      setSearchTerm('');
      
      if (onInviteSuccess) {
        onInviteSuccess();
      }
      
      // Auto close modal after success
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Send invitation failed:', error);
      message.error(error.response?.data?.message || 'Gửi lời mời thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveInvitation = async (invitationId) => {
    // Temporarily disabled until backend API is implemented
    message.info('Chức năng xóa lời mời sẽ được cập nhật sau');
    return;
    
    // try {
    //   setLoading(true);
    //   const endpoint = entityType === 'quiz' 
    //     ? `/quiz-sets/${entityId}/invitations/${invitationId}` 
    //     : `/flashcard-sets/${entityId}/invitations/${invitationId}`;
      
    //   await api.delete(endpoint);
      
    //   // Show success message
    //   message.success('Xóa lời mời thành công!');
      
    //   // Refresh invited users list
    //   await fetchInvitedUsers();
    // } catch (error) {
    //   console.error('Remove invitation failed:', error);
    //   message.error(error.response?.data?.message || 'Xóa lời mời thất bại');
    // } finally {
    //   setLoading(false);
    // }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSelectedUser(null);
    setShowSearchResults(false);
    inputRef.current?.focus();
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserPlus size={20} style={{ color: '#1890ff' }} />
          <span>Mời người dùng vào {entityType === 'quiz' ? 'Quiz' : 'Flashcard'}</span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={800}
      centered
      destroyOnClose
    >
      <div style={{ marginTop: '20px' }}>
        {/* Search User Section */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#262626' }}>
            Tìm kiếm người dùng
          </h3>
          
          <div className="relative" ref={searchContainerRef}>
            <Input
              ref={inputRef}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowSearchResults(true)}
              placeholder="Nhập tên người dùng hoặc email..."
              prefix={<Search size={16} style={{ color: '#8c8c8c' }} />}
              suffix={
                searchTerm && (
                  <X 
                    size={16} 
                    style={{ color: '#8c8c8c', cursor: 'pointer' }}
                    onClick={clearSearch}
                  />
                )
              }
              style={{ width: '100%' }}
            />

            {/* Search Results Dropdown */}
            {showSearchResults && searchTerm && (
              <div 
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: '4px',
                  backgroundColor: 'white',
                  border: '1px solid #d9d9d9',
                  borderRadius: '6px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  zIndex: 10,
                  maxHeight: '240px',
                  overflowY: 'auto'
                }}
              >
                {searchLoading ? (
                  <div style={{ padding: '16px', textAlign: 'center', color: '#8c8c8c' }}>
                    Đang tìm kiếm...
                  </div>
                ) : searchResults.length > 0 ? (
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                    {searchResults.map((user) => (
                      <li
                        key={user.id || user.accountId}
                        onClick={() => handleUserSelect(user)}
                        style={{
                          padding: '12px',
                          cursor: 'pointer',
                          borderBottom: '1px solid #f0f0f0',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            backgroundColor: '#e6f7ff',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <UserPlus size={16} style={{ color: '#1890ff' }} />
                          </div>
                          <div>
                            <p style={{ margin: 0, fontWeight: '500', color: '#262626' }}>
                              {user.username}
                            </p>
                            <p style={{ margin: 0, fontSize: '12px', color: '#8c8c8c' }}>
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div style={{ padding: '16px', textAlign: 'center', color: '#8c8c8c' }}>
                    Không tìm thấy người dùng
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Selected User Display */}
          {selectedUser && (
            <div style={{
              backgroundColor: '#e6f7ff',
              border: '1px solid #91d5ff',
              borderRadius: '6px',
              padding: '16px',
              marginTop: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#bae7ff',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <UserPlus size={20} style={{ color: '#1890ff' }} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: '500', color: '#0050b3' }}>
                      {selectedUser.username}
                    </p>
                    <p style={{ margin: 0, fontSize: '12px', color: '#1890ff' }}>
                      {selectedUser.email}
                    </p>
                  </div>
                </div>
                <X 
                  size={16} 
                  style={{ color: '#1890ff', cursor: 'pointer' }}
                  onClick={() => setSelectedUser(null)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Permission Selection */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#262626' }}>
            Quyền truy cập
          </h3>
          <Select
            value={permission}
            onChange={setPermission}
            style={{ width: '100%' }}
            options={[
              { value: 'VIEW', label: 'Xem (VIEW)' },
              { value: 'EDIT', label: 'Chỉnh sửa (EDIT)' }
            ]}
          />
        </div>

        {/* Send Invitation Button */}
        <Button
          type="primary"
          onClick={handleSendInvitation}
          disabled={!selectedUser || loading}
          loading={loading}
          icon={<UserPlus size={16} />}
          style={{
            width: '100%',
            height: '40px',
            background: 'linear-gradient(45deg, #1890ff, #40a9ff)',
            border: 'none',
            boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)'
          }}
        >
          Gửi lời mời
        </Button>

        {/* Invited Users List - Temporarily disabled */}
        <div style={{ marginTop: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#262626' }}>
            Danh sách người đã mời
          </h3>
          
          <div style={{ 
            textAlign: 'center', 
            padding: '32px', 
            color: '#8c8c8c',
            backgroundColor: '#fafafa',
            borderRadius: '6px',
            border: '1px solid #f0f0f0'
          }}>
            <div style={{ marginBottom: '8px' }}>
              <UserPlus size={32} style={{ color: '#d9d9d9' }} />
            </div>
            <p style={{ margin: 0, fontSize: '14px' }}>
              Chức năng quản lý danh sách người đã mời sẽ được cập nhật sau
            </p>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#bfbfbf' }}>
              Hiện tại chỉ có thể gửi lời mời mới
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default InviteModal;
