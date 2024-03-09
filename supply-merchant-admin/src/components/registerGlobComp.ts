import type { App } from 'vue';
import { Button } from './Button';
import { Input, Layout, Table, Select } from 'ant-design-vue';
const { Option } = Select

export function registerGlobComp(app: App) {
  app
    .use(Input)
    .use(Button)
    .use(Layout)
    .use(Table)
    .use(Select)
    .use(Option)
}

