import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Container,
  Paper,
  Group,
  Title,
  Text,
  Stack,
  Button,
  Badge,
  Grid,
  Divider,
  Loader,
  Modal,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconArrowLeft,
  IconBook,
  IconUser,
  IconBuildingBank,
  IconCopy,
  IconTrash,
} from '@tabler/icons-react';
import API from '../api/API';

const InfoCard = ({ icon, label, value, accent }) => (
  <Paper
    withBorder
    radius="md"
    p="lg"
    bg="#030712"
    style={{ height: '100%', border: '1px solid #374151' }}
  >
    <Group gap="md">
      {icon}
      <Stack gap={4}>
        <Text size="sm" c="dimmed">
          {label}
        </Text>
        {accent ? (
          accent
        ) : (
          <Text fw={600} size="md" c="white">
            {value}
          </Text>
        )}
      </Stack>
    </Group>
  </Paper>
);

const BooksDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);

  const { data, isLoading } = useQuery({
    queryKey: ['book-detail', id],
    queryFn: () => API.get(`/books/book/${id}`).then((res) => res.data),
    enabled: !!id,
  });

  const book = data;

  const deleteMutation = useMutation({
    mutationFn: () => API.delete(`/books/book/${id}`),
    onSuccess: () => navigate('/books'),
  });

  if (isLoading) {
    return (
      <Container size="xl" py={100}>
        <Group justify="center">
          <Loader size="lg" />
        </Group>
      </Container>
    );
  }

  return (
    <div className="book-detail">
      <Button
        component={Link}
        to="/books"
        variant="outline"
        leftSection={<IconArrowLeft size={16} />}
        mb="xl"
      >
        Kitoblarga qaytish
      </Button>

      <Group mb="lg">
        <IconBook size={34} color="#7c3aed" />
        <Title style={{ color: '#f3f4f6' }} order={2}>
          {book?.name}
        </Title>
      </Group>

      <Divider className="book-detail-divider" mb="xl" />

      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, md: 4 }}>
          <InfoCard
            icon={<IconUser color="white" size={30} />}
            label="Muallif"
            value={book?.author}
            style={{
              backgroundColor: '#030712',
              border: '1px solid #374151',
            }}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <InfoCard
            icon={<IconBuildingBank color="white" size={30} />}
            label="Nashriyot"
            value={book?.publisher}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <InfoCard
            icon={<IconCopy color="white" size={30} />}
            label="Mavjud nusxalar"
            accent={
              <Badge
                style={{
                  backgroundColor: '#22c55e1a',
                  border: '1px solid rgba(34, 197, 94, .2)',
                  color: '#22c55e',
                  borderRadius: '16px !important',
                  width: 90,
                  height: 27,
                  fontFamily: 'gest-m',
                  letterSpacing: '0.7px',
                  textTransform: 'capitalize',
                }}
                color="green"
                radius="xl"
                size="lg"
              >
                {book?.quantity_in_library} nusxa
              </Badge>
            }
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <InfoCard
            icon={<IconBuildingBank color="white" size={30} />}
            label="Kutubxona"
            accent={
              <Text fw={600} c="violet">
                Kutubxona №{book?.library}
              </Text>
            }
          />
        </Grid.Col>
      </Grid>

      <Divider className="book-detail-divider" my="xl" />

      <Group justify="flex-end">
        <Button color="violet" leftSection={<IconTrash size={16} />} onClick={open}>
          Kitobni o'chirish
        </Button>
      </Group>

      <Modal opened={opened} onClose={close} centered title="Kitobni o'chirish">
        <Text mb="md">Ushbu kitobni o'chirishni tasdiqlaysizmi?</Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={close}>
            Bekor qilish
          </Button>
          <Button
            color="red"
            loading={deleteMutation.isLoading}
            onClick={() => deleteMutation.mutate()}
          >
            O'chirish
          </Button>
        </Group>
      </Modal>
    </div>
  );
};

export default BooksDetail;
