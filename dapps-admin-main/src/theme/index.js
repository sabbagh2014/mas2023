import _ from "lodash";
import { colors, createMuiTheme, responsiveFontSizes } from "@material-ui/core";
import typography from "./typography";

const baseOptions = {
  typography,
  overrides: {
    MuiFormLabel: {
      root: { color: "#222" },
    },
    MuiList: {
      padding: {
        padding: "10px",
      },
    },
    MuiListSubheader: {
      root: {
        color: "#000000",
        fontSize: "22px !important",
        fontWeight: "600 !important",
        lineHeight: "33px !important",
      },
    },
    MuiFormHelperText: {
      contained: {
        marginLeft: "0",
      },
    },
    PrivateNotchedOutline: {
      root: {
        height: "51px",
      },
    },
    MuiOutlinedInput: {
      input: {
        padding: "16.5px 14px",
      },
      notchedOutline: {
        // borderColor: "transparent",
      },
    },
    MuiPopover: {
      root: {
        zIndex: 99999,
      },
    },
    MuiListItem: {
      gutters: {
        paddingLeft: 0,
      },
    },
    MuiListItemSecondaryAction: {
      root: {
        right: 0,
      },
    },
    MuiDialog: {
      paperScrollPaper: {
        Width: 450,
        maxWidth: "100%",
      },
      paper: {
        overflowY: "unset",
      },
    },
    MuiInputBase: {
      input: {
        fontSize: 14,
        color: "#222",
      },
      inputMultiline: {
        height: "20px",
      },
    },
    MuiBackdrop: {
      root: { backgroundColor: "rgba(0, 0, 0, 0.75)" },
    },

    MuiButton: {
      containedSecondary: {
        background: "linear-gradient(180deg, #c04848 0%, #480048 100%);",
        filter: "drop-shadow(0px 3px 3.5px rgba(0,0,0,0.16))",
        borderRadius: "50px",
        color: "#fff",
        fontSize: "15px",
        // lineHeight: " 21px",
        padding: "8px 22px",
      },

      containedPrimary: {
        backgroundColor: "#fff",
        filter: "drop-shadow(0px 3px 3.5px rgba(0,0,0,0.16))",
        borderRadius: "50px",
        color: "#fff",
        fontSize: "15px",

        padding: "8px 22px",
      },
      contained: {
        borderRadius: "50px",
        color: "#a53848",
        fontWeight: 600,
        background: "#fff",
        padding: "8px 22px",
        background: "linear-gradient(180deg, #c04848 0%, #480048 100%);",
        color: "#fff",
        "&:hover": {
          background: "linear-gradient(180deg, #c04848 0%, #480048 100%);",

          color: "#fff",
        },
      },
      outlinedPrimary: {
        borderRadius: "50px",
        color: "#0D8CCD",
        fontWeight: 600,
        padding: "5px 19px",
        border: "2px solid #0D8CCD",
        "&:hover": {
          background:
            "linear-gradient(180deg, #039BE3 0%, #039BE2 0.01%, #3A4B6E 100%), #000000",
          border: "2px solid #0D8CCD",
          color: "#fff",
        },
      },
      outlinedSizeSmall: {
        padding: "6px 23px",
        fontSize: "16px",
        lineHeight: " 24px",
      },
    },
    MuiDrawer: {
      paperAnchorDockedLeft: {
        borderRight: "0",
      },
    },
    MuiMenu: {
      paper: { top: "47px" },
    },
    MuiSelect: {
      selectMenu: {
        height: "16px !important",
      },
    },

    MuiTypography: {
      subtitle1: {
        color: "#000",
        fontSize: "14px",
        fontWeight: 500,
        lineHeight: " 16px",
      },
    },
  },
};

const themesOptions = {
  typography: {
    fontWeight: 400,
    fontFamily: "'Poppins', sans-serif",
  },
  palette: {
    type: "light",
    action: {
      primary: "#20509e",
    },
    background: {
      default: "#FBFBFD",
      dark: "#f3f7f9",
      paper: colors.common.white,
    },
    primary: {
      main: "#898989",
      dark: "#de0d0d",
      light: "#de0d0d",
    },
    secondary: {
      main: "#fff",
    },
    warning: {
      main: "#ffae33",
      dark: "#ffae33",
      light: "#fff1dc",
    },
    success: {
      main: "#54e18c",
      dark: "#54e18c",
      light: "#e2faec",
    },
    error: {
      main: "#ff7d68",
      dark: "#ff7d68",
      light: "#ffe9e6",
    },
    text: {
      primary: "#52565c",
      secondary: "#999999",
    },
    common: {
      black: "#222222",
    },
  },
};

export const createTheme = (config = {}) => {
  let theme = createMuiTheme(_.merge({}, baseOptions, themesOptions));

  if (config.responsiveFontSizes) {
    theme = responsiveFontSizes(theme);
  }

  return theme;
};
