export interface User {
  data: {
    id: string;
    email: string;
    username: string;
    full_name: string;
    display_name: string;
    website: string;
    human_readable_website: string;
    is_email_public: boolean;
    is_hireable: boolean;
    photo: string;
    is_email_confirmed: boolean;
    photo_public: boolean;
    timezone: string;
    last_heartbeat_at: string;
    last_project: string;
    last_plugin: string;
    last_plugin_name: string;
    plan: string;
    created_at: string;
    modified_at: string;
  };
}
