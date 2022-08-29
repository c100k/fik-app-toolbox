import {
    CSS,
    Enum,
    FreeTextShort,
    Html,
    IUseCaseDefinition,
    IUseCaseInput,
    IUseCaseInputFieldValue,
    IUseCaseOutput,
    IUseCaseOutputPart,
    IUseCaseOutputPartItem,
    IWebViewLayoutInput,
} from '@sdk';

export interface ITranslateInput extends IUseCaseInput {
    dictionary: IUseCaseInputFieldValue<Enum>;
    expression: IUseCaseInputFieldValue<FreeTextShort>;
}

interface IOutputPartItem0 extends IUseCaseOutputPartItem {
    css: CSS;
    html: Html;
}

export interface ITranslateOutput extends IUseCaseOutput {
    _0: IUseCaseOutputPart<IOutputPartItem0, IWebViewLayoutInput>;
}

export const TranslateUseCaseDefinition: IUseCaseDefinition<
    ITranslateInput,
    ITranslateOutput
> = {
    io: {
        input: {
            callToActionLabel: {
                idle: {
                    en: 'Send',
                },
                loading: {
                    en: 'Sending',
                },
            },
            fields: [
                {
                    choices: {
                        static: [
                            { label: { en: '🇫🇷 🇬🇧' }, value: 'fren' },
                            { label: { en: '🇫🇷 🇪🇸' }, value: 'fres' },
                            { label: { en: '🇫🇷 🇩🇪' }, value: 'frde' },
                            { label: { en: '🇬🇧 🇫🇷' }, value: 'enfr' },
                            { label: { en: '🇪🇸 🇫🇷' }, value: 'esfr' },
                        ],
                    },
                    key: 'dictionary',
                    type: {
                        code: 'Enum',
                        examples: ['enit'],
                    },
                },
                {
                    key: 'expression',
                    type: {
                        code: 'FreeTextShort',
                        examples: ['Radis'],
                    },
                },
            ],
        },
        output: {
            parts: [
                {
                    fields: [
                        {
                            key: 'css',
                            type: {
                                code: 'CSS',
                            },
                        },
                        {
                            key: 'html',
                            type: {
                                code: 'Html',
                            },
                        },
                    ],
                },
            ],
        },
    },
    lifecycle: {
        client: {
            main: async (useCase, { cryptoManager, webBrowser }) => {
                const dictionary = useCase.requireFromInput<Enum>('dictionary');
                const expression =
                    useCase.requireFromInput<FreeTextShort>('expression');

                const output: ITranslateOutput = {
                    _0: {
                        items: [],
                        layout: {
                            get: (item) => ({
                                css: item.css,
                                html: item.html,
                            }),
                            type: 'WebView',
                        },
                    },
                };

                const response = await webBrowser.open(
                    `https://www.wordreference.com/${dictionary}/${expression}`,
                    '.WRD',
                );
                output._0.items.push({
                    css: '',
                    html: response || 'Nothing found',
                    id: cryptoManager.randomUUID(),
                });

                return output;
            },
        },
    },
    metadata: {
        action: 'Translate',
        icon: 'trail-sign-outline',
        label: {
            en: 'Translate',
        },
        name: 'Translate',
    },
};
