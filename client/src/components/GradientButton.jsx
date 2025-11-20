// import the required components from 'antd'
import { Button, ConfigProvider } from "antd";

// import the `createStyles` hook from 'antd-style'
import { createStyles } from "antd-style";

const useStyle = createStyles(({ prefixCls, css }) => ({
  linearGradientButton: css`
    &.${prefixCls}-btn-primary:not([disabled]):not(
        .${prefixCls}-btn-dangerous
      ) {
      & > span {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      &::before {
        content: "";
        background: linear-gradient(135deg, var(--cursor), var(--accent));
        position: absolute;
        inset: -1px;
        opacity: 1;
        transition: all 0.3s;
        border-radius: inherit;
        z-index: 0;
      }

      &:hover::before {
        opacity: 0;
      }
    }
  `,
}));

function GradientButton({ text, icon, ...props }) {
  const { styles } = useStyle();

  return (
    <ConfigProvider
      button={{
        className: styles.linearGradientButton,
      }}
    >
      <Button type="primary" size="middle" {...props}>
        {icon && <span className="gradient-button-icon">{icon}</span>}
        {text}
      </Button>
    </ConfigProvider>
  );
}

export default GradientButton;
