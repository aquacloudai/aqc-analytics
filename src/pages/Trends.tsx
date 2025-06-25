import { Title, Paper, Tabs, Table, Text, Badge, Loader, Alert, ScrollArea, Group, Stack, Button } from '@mantine/core';
import { useState, useEffect } from 'react';
import api from '../services/api';
import { isKeycloakReady } from '../config/keycloak';
import { IconAlertCircle, IconDownload } from '@tabler/icons-react';
import type { Codelist } from '../types/codelist';




export function Trends() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isKeycloakReady()) return;

    const fetchCodelist = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await api.get<{ data: Codelist[] }>('/v2/mortality/categories/codelist');

      } catch (error) {
        console.error('[Dashboard] Failed to fetch codelist:', error);
        setError('Kunne ikke laste kodelist. Vennligst prøv igjen.');
      } finally {
        setLoading(false);
      }
    };

    fetchCodelist();
  }, []);

  if (loading) {
    return (
      <Stack align="center" mt="xl">
        <Loader size="lg" />
        <Text>Laster kodelist...</Text>
      </Stack>
    );
  }

  if (error) {
    return (
      <Alert 
        icon={<IconAlertCircle size="1rem" />} 
        title="Feil" 
        color="red"
        mt="lg"
      >
        {error}
      </Alert>
    );
  }







  return (
    <div>
      
    </div>
  );
}