import { defineMvuDataStore } from '@util/mvu';
import { Schema } from '../../schema';

// Schema 顶层有 .prefault({}) 包装，使用 as any 绕过 ZodObject 类型约束

export const useDataStore = defineMvuDataStore(Schema as any, { type: 'message', message_id: getCurrentMessageId() });
