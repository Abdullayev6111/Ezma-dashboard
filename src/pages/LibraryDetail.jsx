import { useQuery } from '@tanstack/react-query';
import {
  Container,
  Title,
  Group,
  Text,
  Stack,
  Paper,
  ScrollArea,
  Table,
  Badge,
} from '@mantine/core';
import { Link, useParams } from 'react-router-dom';
import {
  IconBrandTelegram,
  IconBrandInstagram,
  IconInfoCircle,
  IconMapPin,
  IconArrowLeft,
} from '@tabler/icons-react';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import API from './../api/API';
import { useTranslation } from 'react-i18next';

const LibrariesDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();

  const { data: libraryData, isLoading } = useQuery({
    queryKey: ['library', id],
    queryFn: () => API.get(`/libraries/library/${id}`).then((res) => res.data),
  });

  const library = libraryData?.results?.library;
  const books = libraryData?.results?.books || [];
  const phone = libraryData?.results?.phone || '+998977777777';
  const totalBooks = libraryData?.results?.total_books || books.length;

  const coordinates = [41.315, 69.29];

  if (isLoading) {
    return (
      <Container size="xl" my={100} mx="auto" style={{ maxWidth: 1400 }}>
        <Paper radius="lg" h={500} bg="dark.7" mb="xl" />
        <Paper radius="lg" h={400} bg="dark.7" />
      </Container>
    );
  }

  return (
    <div className="library-detail">
      <Group mb="xl">
        <Link
          to="/libraries"
          style={{
            color: '#4dabf7',
            textDecoration: 'none',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <IconArrowLeft size={18} />
          {t('libraryDetail.goBack')}
        </Link>
      </Group>

      <Group grow align="stretch" gap="xl" mb="xl">
        <Paper className="library-detail-info" radius="lg" p="xl" withBorder bg="dark.7">
          <Stack gap="xl">
            <div>
              <Group align="center" gap="md" mb="lg">
                <IconInfoCircle size={20} color="#8b5cf6" />
                <Title order={4} c="white">
                  {t('libraryDetail.aboutLibrary')}
                </Title>
              </Group>
              <Stack gap="md">
                <Group align="flex-start" wrap="nowrap">
                  <Text size="sm" fw={600} c="dimmed" style={{ minWidth: 90 }}>
                    {t('libraryDetail.address')}:
                  </Text>
                  <Text size="sm" c="white">
                    {library?.address ||
                      '10, Afrasiyab Street, Yunus Rajabi mahalla, Yakkasaray District, Tashkent, 100000, Uzbekistan'}
                  </Text>
                </Group>
                <Group align="flex-start" wrap="nowrap">
                  <Text size="sm" fw={600} c="dimmed" style={{ minWidth: 90 }}>
                    {t('libraryDetail.phone')}:
                  </Text>
                  <Text size="sm" c="white">
                    {phone}
                  </Text>
                </Group>
              </Stack>
            </div>

            <div>
              <Group align="center" gap="md" mb="lg">
                <IconInfoCircle size={20} color="#8b5cf6" />
                <Title order={4} c="white">
                  {t('libraryDetail.socials')}
                </Title>
              </Group>
              <Stack gap="lg">
                <Group gap="md">
                  <IconBrandTelegram size={22} color="#0088cc" />
                  <Text size="sm" c="blue.3" style={{ cursor: 'pointer' }}>
                    Telegram
                  </Text>
                </Group>
                <Group gap="md">
                  <IconBrandInstagram size={22} color="#e4405f" />
                  <Text size="sm" c="pink.3" style={{ cursor: 'pointer' }}>
                    Instagram
                  </Text>
                </Group>
              </Stack>
            </div>
          </Stack>
        </Paper>

        <Paper className="library-detail-info" radius="lg" p="xl" withBorder bg="dark.7">
          <Group align="center" gap="md" mb="lg">
            <IconMapPin size={20} color="#8b5cf6" />
            <Title order={4} c="white">
              {t('libraryDetail.address')}
            </Title>
          </Group>
          <div style={{ height: 400, borderRadius: '0.5rem', overflow: 'hidden' }}>
            <YMaps>
              <Map defaultState={{ center: coordinates, zoom: 15 }} width="100%" height="100%">
                <Placemark geometry={coordinates} />
              </Map>
            </YMaps>
          </div>
        </Paper>
      </Group>

      <Paper
        className="library-detail-info ldi-all-books"
        radius="lg"
        p="md"
        withBorder
        bg="dark.7"
        mb="xl"
      >
        <Group
          justify="apart"
          align="center"
          style={{ background: '#030712', padding: '20px ', borderRadius: 10 }}
        >
          <Text size="lg" fw={700} c="white">
            <i style={{ color: '#6d28d9', fontSize: 40 }} className="fa-solid fa-book"></i>{' '}
            {t('libraries.allBooks')}
          </Text>
          <Badge color="purple" size="xl" radius="md">
            {totalBooks}
          </Badge>
        </Group>
      </Paper>

      <Paper
        className="library-detail-info ldi-last"
        radius="lg"
        withBorder
        bg="dark.7"
        style={{ overflow: 'hidden' }}
      >
        <Group p="xl" pb={0}>
          <Title order={4} p="md" c="white">
            {t('libraryDetail.booksInLibrary')}
          </Title>
        </Group>
        <ScrollArea h={400} type="hover" scrollbarSize={10}>
          <Table highlightOnHover withColumnBorders={false} fontSize="md">
            <Table.Thead className="library-detail-table">
              <Table.Tr>
                <Table.Th c="dimmed" fw={600}>
                  {t('books.bookName')}
                </Table.Th>
                <Table.Th c="dimmed" fw={600}>
                  {t('books.author')}
                </Table.Th>
                <Table.Th c="dimmed" fw={600}>
                  {t('books.publisher')}
                </Table.Th>
                <Table.Th c="dimmed" fw={600} ta="right">
                  {t('libraryDetail.piece')}
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {books.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={4} ta="center" c="dimmed" py="xl">
                    {t('libraryDetail.noBooksAvailable')}
                  </Table.Td>
                </Table.Tr>
              ) : (
                books.map((book, index) => (
                  <Table.Tr key={book.id || index}>
                    <Table.Td c="white" fw={500}>
                      {book.name}
                    </Table.Td>
                    <Table.Td c="white">{book.author || "Noma'lum"}</Table.Td>
                    <Table.Td c="white">{book.publisher || "Noma'lum"}</Table.Td>
                    <Table.Td ta="right" c="blue.3" fw={600}>
                      {book.quantity_in_library || 1} {t('libraries.pcs')}
                    </Table.Td>
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        </ScrollArea>
      </Paper>
    </div>
  );
};

export default LibrariesDetail;
