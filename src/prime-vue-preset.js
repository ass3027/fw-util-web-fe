import {definePreset} from "@primeuix/themes";
import Aura from '@primeuix/themes/aura'

export const MyPreset = definePreset(Aura, {
    semantic:{
        primary: {
            0: '{orange.950}',
            50: '{orange.900}',
            100: '{orange.800}',
            200: '{orange.700}',
            300: '{orange.600}',
            400: '{orange.500}',
            500: '{orange.400}',
            600: '{orange.300}',
            700: '{orange.200}',
            800: '{orange.100}',
            900: '{orange.50}',
            950: '{orange.0}'
        },
        colorScheme: {
            light: {
                primary: {
                    contrastColor: '{surface.900}',
                },
                surface: {
                    0: '{neutral.0}',
                    50: '{neutral.50}',
                    100: '{neutral.100}',
                    200: '{neutral.200}',
                    300: '{neutral.300}',
                    400: '{neutral.400}',
                    500: '{neutral.500}',
                    600: '{neutral.600}',
                    700: '{neutral.700}',
                    800: '{neutral.800}',
                    900: '{neutral.900}',
                    950: '{neutral.950}'
                },
                // highlight: {
                //     background: '{neutral.950}',
                //     focusBackground: '{neutral.700}',
                //     color: '#ffffff',
                //     focusColor: '#ffffff'
                // }
            },
            dark: {
                // primary: {
                //     contrastColor: '{surface.900}',
                // },
                surface: {
                    0: '{neutral.950}',
                    50: '{neutral.950}',
                    100: '{neutral.900}',
                    200: '{neutral.800}',
                    300: '{neutral.700}',
                    400: '{neutral.600}',
                    500: '{neutral.500}',
                    600: '{neutral.400}',
                    700: '{neutral.300}',
                    800: '{neutral.200}',
                    900: '{neutral.100}',
                    950: '{neutral.50}'
                },
                // highlight: {
                //     background: '{primary.50}',
                //     focusBackground: '{primary.300}',
                //     color: '{primary.950}',
                //     focusColor: '{primary.950}'
                // }
            }
        }
    },
})
