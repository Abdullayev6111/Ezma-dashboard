import { useForm } from '@mantine/form';
import {
  TextInput,
  PasswordInput,
  Button,
  Switch,
  Paper,
  Stack,
  Title,
  Group,
  Box,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import API from './../api/API';
import {
  YMaps,
  Map,
  Placemark,
  FullscreenControl,
  ZoomControl,
  TypeSelector,
} from '@pbe/react-yandex-maps';
import { useTranslation } from 'react-i18next';

function AddLibrary() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');

  const form = useForm({
    initialValues: {
      name: '',
      phone: '',
      password: '',
      address: '',
      latitude: '',
      longitude: '',
      telegram: '',
      instagram: '',
      facebook: '',
      can_rent_books: false,
    },

    validate: {
      name: (value) => (value.trim() ? null : t('addNewLibrary.nameMust')),
      phone: (value) => (value.trim() ? null : t('addNewLibrary.phoneMust')),
      password: (value) => (value.length >= 6 ? null : t('addNewLibrary.passwordMust')),
      address: (value) => (value.trim() ? null : t('addNewLibrary.addressMust')),
      latitude: (value) => (value ? null : t('addNewLibrary.latMust')),
      longitude: (value) => (value ? null : t('addNewLibrary.longMust')),
    },
  });

  const addLibraryMutation = useMutation({
    mutationFn: (values) =>
      API.post('/auth/register-library/', {
        user: {
          name: values.name.trim(),
          phone: values.phone.replace(/[^0-9]/g, ''),
          password: values.password,
        },
        library: {
          address: values.address.trim(),
          latitude: parseFloat(values.latitude),
          longitude: parseFloat(values.longitude),
          social_media: {
            telegram: values.telegram ? values.telegram.replace('@', '') : null,
            instagram: values.instagram ? values.instagram.replace('@', '') : null,
            facebook: values.facebook ? values.facebook.split('/').pop() : null,
          },
          can_rent_books: values.can_rent_books,
        },
      }),
    onSuccess: () => {
      notifications.show({
        title: t('notification.successTitile'),
        message: t('notification.successMessage'),
        color: 'green',
      });
      form.reset();
      setLocation(null);
      setAddress('');
      queryClient.invalidateQueries({ queryKey: ['libraries'] });
    },
    onError: (err) => {
      notifications.show({
        title: t('notification.errorTitile'),
        message: err.response?.data?.detail || t('notification.errorMessage'),
        color: 'red',
      });
    },
  });

  const getAddressFromCoords = async (coords) => {
    setLocation(coords);
    form.setFieldValue('latitude', coords[0].toFixed(6));
    form.setFieldValue('longitude', coords[1].toFixed(6));

    try {
      const [lat, lng] = coords;
      const response = await fetch(
        `https://geocode-maps.yandex.ru/1.x/?apikey=${
          import.meta.env.VITE_YANDEX_MAPS_API_KEY
        }&geocode=${lng},${lat}&format=json&kind=house&lang=uz_UZ`
      );
      const data = await response.json();

      const fullAddress =
        data.response?.GeoObjectCollection?.featureMember?.[0]?.GeoObject?.metaDataProperty
          ?.GeocoderMetaData?.text || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

      setAddress(fullAddress);
      form.setFieldValue('address', fullAddress);
    } catch (err) {
      console.error('Manzil olishda xato:', err);
      const fallback = `${coords[0].toFixed(6)}, ${coords[1].toFixed(6)}`;
      setAddress(fallback);
      form.setFieldValue('address', fallback);
    }
  };

  const handleMapClick = (e) => {
    const coords = e.get('coords');
    getAddressFromCoords(coords);
  };

  const handlePlacemarkDragEnd = (e) => {
    const newCoords = e.get('target').geometry.getCoordinates();
    getAddressFromCoords(newCoords);
  };

  const handleSubmit = (values) => {
    if (!location) {
      notifications.show({
        message: t('notification.mapMessage'),
        color: 'red',
      });
      return;
    }
    addLibraryMutation.mutate(values);
  };

  return (
    <div className="add-library">
      <Paper
        withBorder
        shadow="lg"
        style={{ border: '1px solid #374151' }}
        bg={'#030712'}
        p={20}
        radius="lg"
      >
        <Stack align="center" mb={40}>
          <Title style={{ color: '#f3f4f6', fontFamily: 'gest-b', fontSize: 32 }} order={1}>
            {t('aside.addLibrary')}
          </Title>
        </Stack>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack spacing="xl">
            <div>
              <Title
                order={4}
                mb="md"
                style={{
                  color: '#f3f4f6',
                  fontFamily: 'gest-b',
                  fontSize: 20,
                  borderBottom: '1px solid #374151',
                  paddingBottom: 7,
                }}
              >
                {t('addNewLibrary.userInfo')}
              </Title>
              <Group grow>
                <TextInput
                  label={t('addNewLibrary.name')}
                  placeholder={t('addNewLibrary.userName')}
                  required
                  {...form.getInputProps('name')}
                />
                <TextInput
                  label={t('addNewLibrary.phone')}
                  placeholder={t('addNewLibrary.phoneNumber')}
                  required
                  {...form.getInputProps('phone')}
                />
                <PasswordInput
                  label={t('addNewLibrary.password')}
                  placeholder={t('addNewLibrary.addPassword')}
                  required
                  {...form.getInputProps('password')}
                />
              </Group>
            </div>

            <div>
              <Title
                order={4}
                mb="md"
                style={{
                  color: '#f3f4f6',
                  fontFamily: 'gest-b',
                  fontSize: 20,
                  borderBottom: '1px solid #374151',
                  paddingBottom: 7,
                }}
              >
                {t('addNewLibrary.libraryInfo')}
              </Title>
              <Group grow>
                <TextInput
                  label={t('addNewLibrary.address')}
                  required
                  value={address}
                  readOnly
                  {...form.getInputProps('address')}
                />
                <TextInput
                  label={t('addNewLibrary.lat')}
                  readOnly
                  required
                  {...form.getInputProps('latitude')}
                />
                <TextInput
                  label={t('addNewLibrary.long')}
                  readOnly
                  required
                  {...form.getInputProps('longitude')}
                />
              </Group>

              <Box
                mt="lg"
                style={{
                  width: '100%',
                  height: 400,
                  border: '1px solid #374151',
                  borderRadius: 12,
                  overflow: 'hidden',
                }}
              >
                <YMaps query={{ apikey: import.meta.env.VITE_YANDEX_MAPS_API_KEY }}>
                  <Map
                    width="100%"
                    height="100%"
                    defaultState={{
                      center: location || [41.311081, 69.240562],
                      zoom: location ? 16 : 11,
                    }}
                    onClick={handleMapClick}
                  >
                    {location && (
                      <Placemark
                        geometry={location}
                        options={{
                          preset: 'islands#redDotIcon',
                          draggable: true,
                        }}
                        properties={{
                          hintContent: 'Kutubxona joylashuvi',
                          balloonContent: address || 'Joylashuv tanlandi',
                        }}
                        onDragEnd={handlePlacemarkDragEnd}
                      />
                    )}
                    <FullscreenControl />
                    <ZoomControl options={{ float: 'right' }} />
                    <TypeSelector options={{ float: 'right' }} />
                  </Map>
                </YMaps>
              </Box>
            </div>

            <div>
              <Title order={4} mb="md">
                {t('addNewLibrary.socials')}
              </Title>
              <Group grow>
                <TextInput
                  label="Telegram"
                  placeholder="Telegram manzili"
                  {...form.getInputProps('telegram')}
                />
                <TextInput
                  label="Instagram"
                  placeholder="Instagram manzili"
                  {...form.getInputProps('instagram')}
                />
                <TextInput
                  label="Facebook"
                  placeholder="Facebook manzili"
                  {...form.getInputProps('facebook')}
                />
              </Group>
            </div>

            <Switch
              label={t('addNewLibrary.isRent')}
              color="#6d28d9"
              {...form.getInputProps('can_rent_books', { type: 'checkbox' })}
            />

            <Group justify="flex-end" mt="xl">
              <Button
                variant="outline"
                color="gray"
                onClick={() => {
                  form.reset();
                  setLocation(null);
                  setAddress('');
                }}
                className="reset-btn"
                disabled={addLibraryMutation.isPending}
              >
                {t('addNewLibrary.resetBtn')}
              </Button>
              <Button type="submit" color="violet" loading={addLibraryMutation.isPending}>
                {t('addNewLibrary.addBtn')}
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </div>
  );
}

export default AddLibrary;
