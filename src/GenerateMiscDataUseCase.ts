import {
    FreeTextShort,
    ILabelValueLayoutInput,
    IUseCaseDefinition,
    IUseCaseInput,
    IUseCaseInputFieldValue,
    IUseCaseOutput,
    IUseCaseOutputPart,
    IUseCaseOutputPartItem,
    Quantity,
    UUID,
} from '@sdk';

export interface IGenerateMiscDataInput extends IUseCaseInput {
    uuidCount: IUseCaseInputFieldValue<Quantity>;
}

interface IOutputPartItem0 extends IUseCaseOutputPartItem {
    label: FreeTextShort;
    value: FreeTextShort;
}

interface IOutputPartItem1 extends IUseCaseOutputPartItem {
    value: UUID;
}

export interface IGenerateMiscDataOutput extends IUseCaseOutput {
    _0: IUseCaseOutputPart<IOutputPartItem0, ILabelValueLayoutInput>;
    _1: IUseCaseOutputPart<IOutputPartItem1>;
}

export const GenerateMiscDataUseCaseDefinition: IUseCaseDefinition<
    IGenerateMiscDataInput,
    IGenerateMiscDataOutput
> = {
    io: {
        input: {
            callToActionLabel: {
                idle: {
                    en: 'Generate',
                },
                loading: {
                    en: 'Generating',
                },
            },
            fields: [
                {
                    cardinality: {
                        min: 0,
                    },
                    description: {
                        en: 'The number of UUIDs you want to generate',
                    },
                    key: 'uuidCount',
                    type: {
                        code: 'Quantity',
                        default: 3,
                        initial: 12,
                    },
                },
            ],
        },
        output: {
            parts: [
                {
                    fields: [
                        {
                            key: 'label',
                            type: {
                                code: 'FreeTextShort',
                            },
                        },
                        {
                            description:
                                'Can be anything but will always be returned as a string',
                            key: 'value',
                            type: {
                                code: 'FreeTextShort',
                            },
                        },
                    ],
                },
                {
                    fields: [
                        {
                            key: 'value',
                            type: {
                                code: 'UUID',
                            },
                        },
                    ],
                },
            ],
        },
    },
    lifecycle: {
        client: {
            main: async (
                useCase,
                { TypeUtils, cryptoManager, dateTimeManager },
            ) => {
                const uuidCount =
                    useCase.requireFromInput<Quantity>('uuidCount');

                const output: IGenerateMiscDataOutput = {
                    _0: {
                        items: [],
                        label: 'Misc',
                        layout: {
                            get: (item) => ({
                                label: item.label,
                                value: item.value.toString(),
                            }),
                            type: 'LabelValue',
                        },
                    },
                    _1: {
                        items: [],
                        label: 'UUIDs',
                    },
                };

                output._0.items.push({
                    id: cryptoManager.randomUUID(),
                    label: 'Timestamp',
                    value: dateTimeManager.timestamp().toString(),
                });

                output._1.items = TypeUtils.range(uuidCount).map(() => ({
                    id: cryptoManager.randomUUID(),
                    value: cryptoManager.randomUUID(),
                }));

                return output;
            },
        },
    },
    metadata: {
        action: 'Generate',
        description: {
            en: 'Generate misc data used when developing like timestamp, UUIDs, etc.',
        },
        icon: 'build-outline',
        label: {
            en: 'Generate misc data',
        },
        name: 'GenerateMiscData',
    },
};
