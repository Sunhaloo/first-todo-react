// import the required components from 'antd'
import { Button, ConfigProvider, Space } from "antd";

// import the `createStyles` hook from 'antd-style'
import { createStyles } from "antd-style";

const useStyle = createStyles(({ prefixCls, css }) => ({
  linearGradientButton: css`
    &.${prefixCls}-btn-primary:not([disabled]):not(
        .${prefixCls}-btn-dangerous
      ) {
      > span {
        position: relative;
      }

      &::before {
        content: "";
        background: linear-gradient(135deg, var(--cursor), var(--accent));
        position: absolute;
        inset: -1px;
        opacity: 1;
        transition: all 0.3s;
        border-radius: inherit;
      }

      &:hover::before {
        opacity: 0;
      }
    }
  `,
}));

function GradientButton({ text, ...props }) {
  const { styles } = useStyle();

  return (
    <ConfigProvider
      button={{
        className: styles.linearGradientButton,
      }}
    >
      <Space>
        <Button type="primary" size="large" {...props}>
          {text}
        </Button>
      </Space>
    </ConfigProvider>
  );
}

export default GradientButton;
