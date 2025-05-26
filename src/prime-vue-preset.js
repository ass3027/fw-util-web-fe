import {definePreset} from "@primeuix/themes";
import Aura from '@primeuix/themes/aura'

export const MyPreset = definePreset(Aura, {
    semantic:{
        primary: {
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
        colorScheme: {

            light: {
                primary: {
                    color: '{primary.950}',
                    contrastColor: '#ffffff',
                    hoverColor: '{primary.800}',
                    activeColor: '{primary.700}'
                },
                surface: {
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
                highlight: {
                    background: '{primary.950}',
                    focusBackground: '{primary.700}',
                    color: '#ffffff',
                    focusColor: '#ffffff'
                }
            },
            dark: {
                primary: {
                    color: '{primary.50}',
                    contrastColor: '{primary.950}',
                    hoverColor: '{primary.200}',
                    activeColor: '{primary.300}'
                },
                surface: {
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
                highlight: {
                    background: '{primary.50}',
                    focusBackground: '{primary.300}',
                    color: '{primary.950}',
                    focusColor: '{primary.950}'
                }
            }
        }
        // colorScheme: {
        //     light: {
        //         surface: {
        //             0: '#ffffff',
        //             50: '{zinc.50}',
        //             100: '{zinc.100}',
        //             200: '{zinc.200}',
        //             300: '{zinc.300}',
        //             400: '{zinc.400}',
        //             500: '{zinc.500}',
        //             600: '{zinc.600}',
        //             700: '{zinc.700}',
        //             800: '{zinc.800}',
        //             900: '{zinc.900}',
        //             950: '{zinc.950}'
        //         },
        //         primary: {
        //             color: '{neutral.800}',
        //             contrastColor: '{neutral.50}',
        //             background: '{neutral.50}'
        //         },
        //         content: {
        //             background: '{neutral.50}'
        //         }
        //     },
        //     dark: {
        //         surface: {
        //             0: '#ffffff',
        //             50: '{slate.50}',
        //             100: '{slate.100}',
        //             200: '{slate.200}',
        //             300: '{slate.300}',
        //             400: '{slate.400}',
        //             500: '{slate.500}',
        //             600: '{slate.600}',
        //             700: '{slate.700}',
        //             800: '{slate.800}',
        //             900: '{slate.900}',
        //             950: '{slate.950}'
        //         },
        //         content: {
        //             background: '{neutral.800}'
        //         },
        //         primary: {
        //             color: '{neutral.50}',
        //             contrastColor: '{neutral.800}',
        //             background: '{neutral.800}'
        //         },
        //     }
        // }
    },
})
