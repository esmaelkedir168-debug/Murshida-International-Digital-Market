import { isRTLLocale } from '../localeDetector.js';

export const createRTLStyles = (locale) => {
  const isRTL = isRTLLocale(locale);

  return {
    direction: isRTL ? 'rtl' : 'ltr',
    textAlign: isRTL ? 'right' : 'left',
    marginInlineStart: 'margin-inline-start',
    marginInlineEnd: 'margin-inline-end',
    paddingInlineStart: 'padding-inline-start',
    paddingInlineEnd: 'padding-inline-end',
    insetInlineStart: 'inset-inline-start',
    insetInlineEnd: 'inset-inline-end',
    float: isRTL ? 'right' : 'left',
    floatInline: isRTL ? 'inline-end' : 'inline-start',
  };
};

export const rtlProperty = (ltrValue, rtlValue, isRTL) => {
  return isRTL ? rtlValue : ltrValue;
};

export const generateRTLClasses = (baseClass, isRTL) => {
  if (!isRTL) return baseClass;

  const classes = baseClass.split(' ');
  return classes.map(cls => `${cls}--rtl`).join(' ');
};

export const createFlexDirection = (ltrDirection, isRTL) => {
  if (isRTL && ltrDirection === 'row') return 'row-reverse';
  if (isRTL && ltrDirection === 'column') return 'column';
  if (!isRTL && ltrDirection === 'row') return 'row';
  return ltrDirection;
};

export const createMarginStyles = (top = 0, right = 0, bottom = 0, left = 0, isRTL = false) => {
  if (isRTL) {
    return {
      marginTop: top,
      marginRight: left,
      marginBottom: bottom,
      marginLeft: right,
    };
  }
  return {
    marginTop: top,
    marginRight,
    marginBottom: bottom,
    marginLeft: left,
  };
};

export const createPaddingStyles = (top = 0, right = 0, bottom = 0, left = 0, isRTL = false) => {
  if (isRTL) {
    return {
      paddingTop: top,
      paddingRight: left,
      paddingBottom: bottom,
      paddingLeft: right,
    };
  }
  return {
    paddingTop: top,
    paddingRight,
    paddingBottom: bottom,
    paddingLeft: left,
  };
};

export const createPositionStyles = (top = 'auto', right = 'auto', bottom = 'auto', left = 'auto', isRTL = false) => {
  if (isRTL) {
    return {
      top,
      right: left,
      bottom,
      left: right,
    };
  }
  return {
    top,
    right,
    bottom,
    left,
  };
};

export const transformTransformOrigin = (origin, isRTL) => {
  if (!isRTL) return origin;

  const positions = {
    'left': 'right',
    'right': 'left',
    'top': 'top',
    'bottom': 'bottom',
    'center': 'center',
  };

  return origin.split(' ').map(pos => positions[pos] || pos).join(' ');
};
