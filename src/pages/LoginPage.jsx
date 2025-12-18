import { Button, Flex, Input, PasswordInput, Box, Title, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IMaskInput } from 'react-imask';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import API from '../api/API';

const LoginPage = () => {
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      phone: '',
      password: '123456',
    },
    validate: {
      phone: (value) => (!value ? 'Telefon raqamni kiriting' : null),
      password: (value) => (!value ? 'Parol kiriting' : null),
    },
  });

  const { mutate: loginMut, isPending } = useMutation({
    mutationFn: async (body) => {
      const res = await API.post('/auth/login/', body);
      return res.data;
    },
    onSuccess: (data) => {
      useAuthStore.getState().setToken(data.access);
      useAuthStore.getState().setUser(data.user);

      notifications.show({
        title: 'Muvaffaqiyatli!',
        message: 'Xush kelibsiz!',
        color: 'green',
      });

      navigate('/profile', { replace: true });
    },
    onError: (err) => {
      notifications.show({
        title: 'Xato',
        message: err.response?.data?.message || "Raqam yoki parol noto'g'ri",
        color: 'red',
      });
    },
  });

  const handleSubmit = (values) => {
    loginMut({
      phone: values.phone.replace(/[\s()-]/g, ''),
      password: String(values.password),
    });
  };

  return (
    <Box
      h="100vh"
      w="100%"
      style={{
        background: 'linear-gradient(135deg, #050b2c, #0b1a4a)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box w={420}>
        <Title align="center" mb={10} style={{ color: '#6c7cff', fontWeight: 700 }}>
          Ezma Admin
        </Title>

        <Text align="center" c="dimmed" mb={30}>
          Tizimga kirish
        </Text>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Input.Wrapper
            label="Telefon raqam"
            withAsterisk
            mb={20}
            styles={{ label: { color: '#fff' } }}
          >
            <Input
              component={IMaskInput}
              mask="+998 (00) 000-00-00"
              placeholder="Telefon raqamni kiriting"
              size="lg"
              styles={{
                input: {
                  background: 'transparent',
                  borderColor: '#2e3a8c',
                  color: '#fff',
                },
              }}
              {...form.getInputProps('phone')}
              onAccept={(value) => {
                const cleaned = value.replace(/[+\s()-]/g, '');
                form.setFieldValue('phone', cleaned || value);
              }}
            />
          </Input.Wrapper>

          <PasswordInput
            label="Parol"
            placeholder="Parolni kiriting"
            size="lg"
            mb={30}
            styles={{
              label: { color: '#fff' },
              input: {
                background: 'transparent',
                borderColor: '#2e3a8c',
                color: '#fff',
              },
            }}
            {...form.getInputProps('password')}
          />

          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={isPending}
            style={{
              background: 'linear-gradient(90deg, #7b3fe4, #4f7cff)',
              height: 56,
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            KIRISH
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default LoginPage;
