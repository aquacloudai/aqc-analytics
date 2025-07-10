import React from "react";
import { Modal, Stack, Box, Text, Code, Button, CopyButton, Group, Divider } from "@mantine/core";
import type { ApiDetail } from "../types/api_detail.ts";

interface ApiInfoModalProps {
    opened: boolean;
    onClose: () => void;
    apiDetails: ApiDetail[];
}

export function buildApiUrl(baseUrl: string, params?: Record<string, any>): string {
    if (!params || Object.keys(params).length === 0) return baseUrl;
    const search = new URLSearchParams(
        Object.entries(params)
            .filter(([_, v]) => v !== undefined && v !== null && v !== "")
            .map(([k, v]) => [k, String(v)])
    );
    return `${baseUrl}?${search}`;
}

export function ApiInfoModal({ opened, onClose, apiDetails }: ApiInfoModalProps) {
    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="API-kall for dataene på siden"
            size="lg"
            centered
        >
            <Stack gap="xl">
                {apiDetails.map((api, i) => {
                    const fullUrl = buildApiUrl(api.url, api.params);
                    return (
                        <Box key={i}>
                            <Text fw={600} size="lg" mb="md" c="blue">
                                {api.title}
                            </Text>
                            
                            <Stack gap="sm">
                                <Box>
                                    <Text size="sm" fw={500} mb={4} c="dimmed">
                                        Endepunkt
                                    </Text>
                                    <Code block p="sm" style={{ fontSize: '14px' }}>
                                        {api.url}
                                    </Code>
                                </Box>

                                {api.params && Object.keys(api.params).length > 0 && (
                                    <Box>
                                        <Text size="sm" fw={500} mb={4} c="dimmed">
                                            Parameters
                                        </Text>
                                        <Code block p="sm" style={{ fontSize: '12px' }}>
                                            {JSON.stringify(api.params, null, 2)}
                                        </Code>
                                    </Box>
                                )}

                                <Group justify="flex-end" mt="sm">
                                    <CopyButton value={fullUrl}>
                                        {({ copied, copy }) => (
                                            <Button
                                                size="sm"
                                                variant="filled"
                                                color={copied ? "teal" : "blue"}
                                                onClick={copy}
                                                style={{ minWidth: '100px' }}
                                            >
                                                {copied ? "Kopiert!" : "Kopier URL"}
                                            </Button>
                                        )}
                                    </CopyButton>
                                </Group>
                            </Stack>
                            
                            {i < apiDetails.length - 1 && <Divider mt="xl" />}
                        </Box>
                    );
                })}
            </Stack>
        </Modal>
    );
}