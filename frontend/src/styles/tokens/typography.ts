type TypographyVariant =
  | 'display1'
  | 'display2'
  | 'display3'
  | 'title1'
  | 'title2'
  | 'title3'
  | 'heading1'
  | 'heading2'
  | 'headline1'
  | 'headline2'
  | 'body1'
  | 'body1-reading'
  | 'body2'
  | 'body2-reading'
  | 'label1'
  | 'label1-reading'
  | 'label2'
  | 'caption1'
  | 'caption2';

type TypographyWeight = 'regular' | 'medium' | 'bold';

type TypographyStyle = {
  fontSize: string;
  lineHeight: string;
  letterSpacing: string;
};

export const variantMap: Record<TypographyVariant, TypographyStyle> = {
  display1: { fontSize: '5.6rem', lineHeight: '7.2rem', letterSpacing: '-0.0319em' },
  display2: { fontSize: '4rem', lineHeight: '5.2rem', letterSpacing: '-0.0282em' },
  display3: { fontSize: '3.6rem', lineHeight: '4.8rem', letterSpacing: '-0.027em' },
  title1: { fontSize: '3.2rem', lineHeight: '4.4rem', letterSpacing: '-0.0253em' },
  title2: { fontSize: '2.8rem', lineHeight: '3.8rem', letterSpacing: '-0.0236em' },
  title3: { fontSize: '2.4rem', lineHeight: '3.2rem', letterSpacing: '-0.023em' },
  heading1: { fontSize: '2.2rem', lineHeight: '3rem', letterSpacing: '-0.0194em' },
  heading2: { fontSize: '2rem', lineHeight: '2.8rem', letterSpacing: '-0.012em' },
  headline1: { fontSize: '1.8rem', lineHeight: '2.6rem', letterSpacing: '-0.002em' },
  headline2: { fontSize: '1.7rem', lineHeight: '2.4rem', letterSpacing: '0em' },
  body1: { fontSize: '1.6rem', lineHeight: '2.4rem', letterSpacing: '0.0057em' },
  'body1-reading': { fontSize: '1.6rem', lineHeight: '2.6rem', letterSpacing: '0.0057em' },
  body2: { fontSize: '1.5rem', lineHeight: '2.2rem', letterSpacing: '0.0096em' },
  'body2-reading': { fontSize: '1.5rem', lineHeight: '2.4rem', letterSpacing: '0.0096em' },
  label1: { fontSize: '1.4rem', lineHeight: '2rem', letterSpacing: '0.0145em' },
  'label1-reading': { fontSize: '1.4rem', lineHeight: '2.2rem', letterSpacing: '0.0145em' },
  label2: { fontSize: '1.3rem', lineHeight: '1.8rem', letterSpacing: '0.0194em' },
  caption1: { fontSize: '1.2rem', lineHeight: '1.6rem', letterSpacing: '0.0252em' },
  caption2: { fontSize: '1.1rem', lineHeight: '1.4rem', letterSpacing: '0.0311em' },
};

export const getWeightMap = (variant: TypographyVariant): Record<TypographyWeight, number> => ({
  regular: 400,
  medium: 500,
  bold:
    variant === 'display1' ||
    variant === 'display2' ||
    variant === 'display3' ||
    variant === 'title1' ||
    variant === 'title2' ||
    variant === 'title3'
      ? 700
      : 600,
});

const variantVariablesCss = Object.entries(variantMap)
  .map(([variant, style]) => {
    return [
      `--typography---${variant}---font-size: ${style.fontSize};`,
      `--typography---${variant}---line-height: ${style.lineHeight};`,
      `--typography---${variant}---letter-spacing: ${style.letterSpacing};`,
    ].join('\n  ');
  })
  .join('\n  ');

const weightVariablesCss = [
  '--typography---weight---regular: 400;',
  '--typography---weight---medium: 500;',
  `--typography---weight---bold-display-title: ${getWeightMap('display1').bold};`,
  `--typography---weight---bold-default: ${getWeightMap('body1').bold};`,
].join('\n  ');

export const typographyVariablesCss = `
  ${variantVariablesCss}
  ${weightVariablesCss}
`;
