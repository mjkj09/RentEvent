const components = {
    MuiTextField: {
        styleOverrides: {
            root: {
                '& .MuiOutlinedInput-root': {
                    borderRadius: 8,
                },
            },
        },
    },
    MuiButton: {
        styleOverrides: {
            root: {
                borderRadius: 8,
                textTransform: 'none',
                fontWeight: 600,
                padding: '12px 24px',
            },
            sizeLarge: {
                padding: '12px 24px',
            },
        },
    },
    MuiPaper: {
        styleOverrides: {
            root: {
                borderRadius: 8,
            },
        },
    },
    MuiAppBar: {
        styleOverrides: {
            root: {
                borderRadius: 0,
            },
        },
    },
    MuiCard: {
        styleOverrides: {
            root: {
                borderRadius: 24,
            },
        },
    },
    MuiSelect: {
        styleOverrides: {
            root: {
                borderRadius: 8,
            },
        },
    },
    MuiMenu: {
        styleOverrides: {
            paper: {
                borderRadius: 8,
            },
        },
    },
    MuiAlert: {
        styleOverrides: {
            root: {
                borderRadius: 8,
            },
        },
    },
};

export default components;