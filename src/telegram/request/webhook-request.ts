import { IsInt, IsObject, IsOptional, IsString } from 'class-validator';

export class TelegramUser {
  id: number;

  is_bot: boolean;

  first_name?: string | null;

  last_name?: string | null;

  language_code?: string | null;

  username?: string | null;
}

export class TelegramChat {
  id: number;

  type: string;

  title?: string | null;

  username?: string | null;

  first_name?: string | null;

  last_name?: string | null;

  is_forum?: boolean | null;
}

export class TelegramMessage {
  media_group_id?: string | null;
  message_id: number;
  from: TelegramUser;
  chat: TelegramChat;
  date: number;
  text?: string | null;
  photo?: TelegramPhoto[];
  document?: TelegramDocument;
  audio?: TelegramAudio;
  voice?: TelegramVoice;
  video?: TelegramVideo;

  caption?: string | null;

  static validateMessage(message: TelegramMessage | null | undefined): boolean {
    if (!message || !message.chat || !message.chat.id) return true;

    return message.text !== null && message.text !== undefined;
  }
}

// Các class con
export class TelegramPhoto {
  file_id: string;
  file_unique_id: string;
  file_size?: number;
  width?: number;
  height?: number;
}

export class TelegramDocument {
  file_id: string;
  file_name?: string;
  mime_type?: string;
  file_size?: number;
}

export class TelegramAudio {
  file_id: string;
  duration?: number;
  performer?: string;
  title?: string;
  mime_type?: string;
  file_size?: number;
}

export class TelegramVoice {
  file_id: string;
  duration?: number;
  mime_type?: string;
  file_size?: number;
}

export class TelegramVideo {
  file_id: string;
  width?: number;
  height?: number;
  duration?: number;
  mime_type?: string;
  file_size?: number;
}

export class TelegramCallbackQuery {
  @IsString()
  id: string;

  @IsObject()
  from: any; // bạn khai báo chi tiết hơn nếu muốn

  @IsString()
  data: string;

  @IsOptional()
  @IsObject()
  message?: TelegramMessage;

  // Các trường khác bạn có thể thêm nếu cần
}

export class TelegramWebhookRequest {
  @IsInt()
  update_id: bigint;

  @IsObject()
  @IsOptional()
  message: TelegramMessage;

  @IsObject()
  @IsOptional()
  edited_message: TelegramMessage;

  @IsObject()
  @IsOptional()
  business_message: TelegramMessage;

  @IsObject()
  @IsOptional()
  edited_business_message: TelegramMessage;

  @IsObject()
  @IsOptional()
  callback_query?: TelegramCallbackQuery;
}
