import {
  Avatar,
  Button,
  Group,
  Stack,
  Text,
  Paper,
  Divider,
  Loader,
  Center,
  TextInput,
  Flex,
  ActionIcon,
} from '@mantine/core';
import { IconUser, IconPhone, IconEdit, IconLogout, IconX } from '@tabler/icons-react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import API from './../api/API';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { useTranslation } from 'react-i18next';

function Profile() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: () => API.get('/auth/admin/profile/').then((res) => res.data),
  });

  const [editMode, setEditMode] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedPhone, setEditedPhone] = useState('');

  const updateProfileMutation = useMutation({
    mutationFn: (updatedData) => API.patch('/auth/admin/profile/', updatedData),
    onSuccess: () => {
      notifications.show({
        title: 'Muvaffaqiyatli!',
        message: "Profil ma'lumotlari yangilandi",
        color: 'green',
      });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setEditMode(false);
    },
    onError: (err) => {
      notifications.show({
        title: 'Xatolik',
        message: err.response?.data?.detail || 'Yangilashda xatolik yuz berdi',
        color: 'red',
      });
    },
  });

  const handleSave = () => {
    if (!editedName.trim() || !editedPhone.trim()) {
      notifications.show({
        title: 'Xatolik',
        message: "Ism va telefon maydonlari to'ldirilishi shart",
        color: 'red',
      });
      return;
    }

    updateProfileMutation.mutate({
      name: editedName,
      phone: editedPhone,
    });
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditedName(data?.name || '');
    setEditedPhone(data?.phone || '');
  };

  const handleEditStart = () => {
    setEditedName(data?.name || '');
    setEditedPhone(data?.phone || '');
    setEditMode(true);
  };

  const handleLogout = async () => {
    try {
      await API.post('/auth/logout/');
    } catch (err) {
      console.warn('Backend logout ishlamadi', err.message);
    } finally {
      logout();
      queryClient.clear();
      navigate('/login', { replace: true });
    }
  };

  if (isLoading) {
    return (
      <Center style={{ height: '100vh' }}>
        <Loader color="violet" size="lg" />
      </Center>
    );
  }

  if (error) {
    return <Center style={{ height: '100vh', color: '#ef4444' }}>{t('profile.loadErr')}</Center>;
  }

  return (
    <Group className="profile-container" align="start" gap={0}>
      <Stack
        align="center"
        justify="start"
        style={{
          width: '100%',
          padding: '50px',
          color: '#e2e8f0',
        }}
      >
        <Flex
          justify="space-between"
          align="center"
          style={{
            width: '100%',
            marginBottom: '40px',
          }}
        >
          <Avatar size={140} radius={100} color="gray" style={{ border: '4px solid #475569' }}>
            <IconUser size={60} stroke={1.5} />
          </Avatar>

          <Group gap="md">
            <Button
              leftSection={<IconEdit size={18} />}
              color="violet"
              radius="xl"
              size="md"
              onClick={editMode ? handleSave : handleEditStart}
              loading={updateProfileMutation.isPending}
            >
              {editMode ? t('profile.profileSave') : t('profile.profileEdit')}
            </Button>

            <Button
              leftSection={<IconLogout size={18} />}
              color="red"
              radius="xl"
              size="md"
              onClick={handleLogout}
            >
              {t('aside.logoutBtn')}
            </Button>
          </Group>
        </Flex>

        <Divider style={{ width: '100%', marginBottom: '40px' }} />

        <Flex gap={50}>
          <Paper
            shadow="sm"
            p="md"
            radius="lg"
            style={{
              backgroundColor: '#1e293b',
              width: '500px',
            }}
          >
            <Group gap="md" align="start">
              <IconUser size={30} color="#a78bfa" />
              <Stack gap={4} style={{ flex: 1 }}>
                <Text size="sm" c="dimmed">
                  {t('profile.name')}
                </Text>
                {editMode ? (
                  <TextInput
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    placeholder="Ismingiz"
                    variant="filled"
                    size="sm"
                  />
                ) : (
                  <Text size="lg" fw={600}>
                    {data?.name || '-'}
                  </Text>
                )}
              </Stack>
              {editMode && (
                <ActionIcon onClick={handleCancel} color="gray" variant="subtle">
                  <IconX size={18} />
                </ActionIcon>
              )}
            </Group>
          </Paper>

          <Paper
            shadow="sm"
            p="md"
            radius="lg"
            style={{
              backgroundColor: '#1e293b',
              width: '500px',
            }}
          >
            <Group gap="md" align="start">
              <IconPhone size={28} color="#a78bfa" />
              <Stack gap={4} style={{ flex: 1 }}>
                <Text size="sm" c="dimmed">
                  {t('profile.phone')}
                </Text>
                {editMode ? (
                  <TextInput
                    value={editedPhone}
                    onChange={(e) => setEditedPhone(e.target.value)}
                    placeholder="+998901234567"
                    variant="filled"
                    size="sm"
                  />
                ) : (
                  <Text size="lg" fw={600}>
                    {data?.phone || '+998900994449'}
                  </Text>
                )}
              </Stack>
              {editMode && (
                <ActionIcon onClick={handleCancel} color="gray" variant="subtle">
                  <IconX size={18} />
                </ActionIcon>
              )}
            </Group>
          </Paper>
        </Flex>
      </Stack>
    </Group>
  );
}

export default Profile;
