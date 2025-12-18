import {
  Tabs,
  TextInput,
  Table,
  Badge,
  ActionIcon,
  Group,
  Pagination,
  Center,
  ScrollArea,
  Loader,
} from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import API from './../api/API';
import { useNavigate } from 'react-router-dom';

function BooksPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['books'],
    queryFn: () => API.get('/books/books/').then((res) => res.data),
  });

  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  const [localLiked, setLocalLiked] = useState(() => {
    const saved = localStorage.getItem('likedBooks');
    return saved ? JSON.parse(saved) : {};
  });

  const handleLike = (id) => {
    setLocalLiked((prev) => {
      const newLiked = { ...prev, [id]: !prev[id] };
      localStorage.setItem('likedBooks', JSON.stringify(newLiked));
      return newLiked;
    });

    queryClient.setQueryData(['books'], (oldData) => {
      if (!oldData) return oldData;
      return oldData.map((item) =>
        item.id === id ? { ...item, is_liked: !localLiked[id] } : item
      );
    });
    queryClient.invalidateQueries({ queryKey: ['books'] });
  };

  const mergedData = useMemo(() => {
    if (!data) return [];
    return data.map((item) => ({
      ...item,
      is_liked: localLiked[item.id] ?? false,
    }));
  }, [data, localLiked]);

  const processedData = useMemo(() => {
    let list = [...mergedData];

    if (activeTab === 'liked') list = list.filter((i) => i.is_liked);
    if (activeTab === 'az') list.sort((a, b) => a.name.localeCompare(b.name));
    if (activeTab === 'za') list.sort((a, b) => b.name.localeCompare(a.name));

    if (search) {
      list = list.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));
    }

    return list;
  }, [mergedData, activeTab, search]);

  const totalPages = Math.ceil(processedData.length / itemsPerPage);
  const paginatedData = processedData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const rows = paginatedData.map((book) => (
    <Table.Tr key={book.id} style={{ cursor: 'pointer' }} className="table-row">
      <Table.Td onClick={(e) => e.stopPropagation()} style={{ padding: '12px 8px' }}>
        <ActionIcon
          variant="subtle"
          onClick={(e) => {
            e.stopPropagation();
            handleLike(book.id);
          }}
          style={{ cursor: 'pointer' }}
        >
          <span style={{ fontSize: '20px', color: book.is_liked ? '#ff0000' : '#ffffff' }}>
            {book.is_liked ? (
              <i className="fa-solid fa-heart" style={{ color: '#ff0000' }}></i>
            ) : (
              <i className="fa-regular fa-heart" style={{ color: '#ffffff' }}></i>
            )}
          </span>
        </ActionIcon>
      </Table.Td>

      <Table.Td
        onClick={() => navigate(`/bookDetail/${book.id}`)}
        style={{ fontWeight: 500, color: '#ffffff' }}
      >
        {book.name}
      </Table.Td>
      <Table.Td onClick={() => navigate(`/bookDetail/${book.id}`)} style={{ color: '#cccccc' }}>
        {book.author || '-'}
      </Table.Td>
      <Table.Td onClick={() => navigate(`/bookDetail/${book.id}`)} style={{ color: '#cccccc' }}>
        {book.publisher || '-'}
      </Table.Td>
      <Table.Td>
        <Badge
          variant="outline"
          style={{
            backgroundColor: '#22c55e1a',
            border: '1px solid rgba(34, 197, 94, .2)',
            color: '#22c55e',
            textTransform: 'lowercase',
          }}
        >
          {book.quantity_in_library}{' '}
          {book.quantity_in_library === 1 ? t('books.copy') : t('books.copies')}
        </Badge>
      </Table.Td>
    </Table.Tr>
  ));

  if (isLoading) {
    return (
      <Center style={{ height: '70vh' }}>
        <Loader color="violet" size="lg" />
      </Center>
    );
  }

  if (error) {
    return <Center style={{ height: '70vh', color: '#ef4444' }}>{t('libraries.error')}</Center>;
  }

  return (
    <div className="library-container">
      <Group justify="space-between" mb="xl">
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="all">{t('books.allBooks')}</Tabs.Tab>
            <Tabs.Tab value="liked">{t('libraries.liked')}</Tabs.Tab>
            <Tabs.Tab value="az">A-Z</Tabs.Tab>
            <Tabs.Tab value="za">Z-A</Tabs.Tab>
          </Tabs.List>
        </Tabs>

        <TextInput
          placeholder={t('books.searchByName')}
          leftSection={<IconSearch size={16} />}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={{ width: 320 }}
        />
      </Group>

      <ScrollArea h="calc(100vh - 280px)">
        <Table
          highlightOnHover
          withRowBorders={false}
          horizontalSpacing="lg"
          verticalSpacing="md"
          styles={{
            table: {
              tableLayout: 'auto',
            },
            tr: {
              '&:hover': {
                backgroundColor: '#1f2937 !impotant',
              },
            },
          }}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th width={60}></Table.Th>
              <Table.Th style={{ color: '#ffffff' }}>{t('books.bookName')}</Table.Th>
              <Table.Th style={{ color: '#cccccc' }}>{t('books.author')}</Table.Th>
              <Table.Th style={{ color: '#cccccc' }}>{t('books.publisher')}</Table.Th>
              <Table.Th style={{ color: '#cccccc' }}>{t('books.hasCopies')}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>

      {totalPages > 1 && (
        <Center mt="xl">
          <Pagination total={totalPages} value={page} onChange={setPage} color="violet" withEdges />
        </Center>
      )}
    </div>
  );
}

export default BooksPage;
