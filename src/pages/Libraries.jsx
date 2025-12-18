import {
  Tabs,
  TextInput,
  Table,
  Badge,
  ActionIcon,
  Group,
  Pagination,
  Center,
  Menu,
  Loader,
} from '@mantine/core';
import { IconSearch, IconDots } from '@tabler/icons-react';
import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import API from './../api/API';

function Libraries() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [localLiked, setLocalLiked] = useState(() => {
    const saved = localStorage.getItem('likedLibraries');
    return saved ? JSON.parse(saved) : {};
  });

  const { data, error, isLoading } = useQuery({
    queryKey: ['libraries'],
    queryFn: () => API.get('/libraries/libraries/').then((res) => res.data),
  });

  const mergedData = useMemo(() => {
    if (!data) return [];
    return data.map((item) => ({
      ...item,
      is_liked: localLiked[item.id] ?? item.is_liked,
    }));
  }, [data, localLiked]);

  const [tab, setTab] = useState('active');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const likeMutation = useMutation({
    mutationFn: (id) => {
      queryClient.setQueryData(['books'], (oldData) => {
        if (!oldData) return oldData;

        return oldData.map((item) =>
          item.id === id ? { ...item, is_liked: !item.is_liked } : item
        );
      });

      setLocalLiked((prev) => {
        const newLiked = { ...prev };
        newLiked[id] = !prev[id];
        localStorage.setItem('likedLibraries', JSON.stringify(newLiked));
        return newLiked;
      });

      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isActive }) => {
      const endpoint = isActive
        ? `/libraries/library/deactivate/${id}/`
        : `/libraries/library/activate/${id}/`;
      return API.patch(endpoint, { is_active: !isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['libraries']);
    },
    onError: (error) => {
      console.error('Xatolik yuz berdi:', error);
      console.error('Response:', error.response?.data);
    },
  });

  const processedData = useMemo(() => {
    if (!mergedData) return [];

    let list = [...mergedData];

    if (tab === 'active') list = list.filter((i) => i.is_active);
    if (tab === 'inactive') list = list.filter((i) => !i.is_active);
    if (tab === 'liked') list = list.filter((i) => i.is_liked);
    if (tab === 'books') list = list.sort((a, b) => b.total_books - a.total_books);

    if (tab === 'az') list.sort((a, b) => a.name.localeCompare(b.name));
    if (tab === 'za') list.sort((a, b) => b.name.localeCompare(a.name));

    if (search) list = list.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));

    return list;
  }, [mergedData, tab, search]);

  const totalPages = Math.ceil(processedData.length / itemsPerPage);
  const paginatedData = processedData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleLike = (e, id) => {
    e.stopPropagation();
    likeMutation.mutate(id);
  };

  const handleToggleStatus = (id, isActive) => {
    toggleStatusMutation.mutate({ id, isActive });
  };

  const rows = paginatedData.map((item) => (
    <Table.Tr key={item.id} className="table-row">
      <Table.Td onClick={(e) => e.stopPropagation()}>
        <ActionIcon
          variant="subtle"
          onClick={(e) => handleLike(e, item.id)}
          style={{ cursor: 'pointer' }}
        >
          <span style={{ fontSize: '20px', color: item.is_liked ? '#ff0000' : '#ffffff' }}>
            {item.is_liked ? (
              <i className="fa-solid fa-heart" style={{ color: '#ff0000' }}></i>
            ) : (
              <i className="fa-regular fa-heart" style={{ color: '#ffffff' }}></i>
            )}
          </span>
        </ActionIcon>
      </Table.Td>

      <Table.Td onClick={() => navigate(`/libraryDetail/${item.id}`)}>{item.name}</Table.Td>

      <Table.Td>
        <Badge
          variant="outline"
          style={{
            backgroundColor: item.is_active ? '#22c55e1a' : '#ef44441a',
            border: item.is_active
              ? '1px solid rgba(34, 197, 94, .2)'
              : '1px solid rgba(239, 68, 68, .2)',
            color: item.is_active ? '#22c55e' : '#ef4444',
            borderRadius: '16px !important',
            width: 62,
            height: 27,
            fontFamily: 'gest-m',
            letterSpacing: '0.7px',
            textTransform: 'capitalize',
          }}
        >
          {item.is_active ? t('libraries.active') : t('libraries.deactive')}
        </Badge>
      </Table.Td>

      <Table.Td onClick={() => navigate(`/libraryDetail/${item.id}`)}>
        {item.address || '-'}
      </Table.Td>

      <Table.Td onClick={() => navigate(`/libraryDetail/${item.id}`)}>
        {item.total_books} {t('libraries.pcs')}
      </Table.Td>

      <Table.Td onClick={(e) => e.stopPropagation()}>
        <Menu position="bottom-end" withArrow>
          <Menu.Target>
            <ActionIcon variant="subtle">
              <IconDots size={18} color="white" />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item onClick={() => handleToggleStatus(item.id, item.is_active)}>
              {item.is_active ? t('libraries.deactivate') : t('libraries.activate')}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Table.Td>
    </Table.Tr>
  ));

  if (isLoading) {
    return (
      <div className="library-container">
        <Center style={{ height: '400px' }}>
          <Loader color="violet" size="lg" />
        </Center>
      </div>
    );
  }

  if (error)
    return (
      <div className="library-container">
        <Center style={{ height: '400px', color: '#ef4444', fontFamily: 'gest-m' }}>
          {t('libraries.error')}
        </Center>
      </div>
    );

  return (
    <div className="library-container">
      <Group justify="space-between" mb="md">
        <Tabs value={tab} onChange={setTab}>
          <Tabs.List>
            <Tabs.Tab value="active">{t('libraries.active')}</Tabs.Tab>
            <Tabs.Tab value="inactive">{t('libraries.deactive')}</Tabs.Tab>
            <Tabs.Tab value="liked">{t('libraries.liked')}</Tabs.Tab>
            <Tabs.Tab value="books">{t('libraries.booksMany')}</Tabs.Tab>
            <Tabs.Tab value="az">A-Z</Tabs.Tab>
            <Tabs.Tab value="za">Z-A</Tabs.Tab>
          </Tabs.List>
        </Tabs>

        <TextInput
          placeholder={t('libraries.search')}
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '300px' }}
        />
      </Group>

      <div
        style={{
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 250px)',
          paddingRight: '10px',
        }}
      >
        <Table highlightOnHover withRowBorders={false} horizontalSpacing="lg" verticalSpacing="md">
          <Table.Thead>
            <Table.Tr>
              <Table.Th></Table.Th>
              <Table.Th>{t('libraries.library')}</Table.Th>
              <Table.Th>{t('libraries.state')}</Table.Th>
              <Table.Th>{t('libraries.address')}</Table.Th>
              <Table.Th>{t('libraries.allBooks')}</Table.Th>
              <Table.Th>{t('libraries.deeds')}</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Center mt="md">
          <Pagination total={totalPages} value={page} onChange={setPage} color="violet" />
        </Center>
      )}
    </div>
  );
}

export default Libraries;
