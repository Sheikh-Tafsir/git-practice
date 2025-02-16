CREATE TABLE aspire_user(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    image TEXT,
    phone VARCHAR(11) UNIQUE,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE aspire_chatbot_list (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_aspire_chatbot_list_user_id 
      FOREIGN KEY (user_id) REFERENCES aspire_user (id) 
      ON UPDATE CASCADE 
      ON DELETE SET NULL
);

CREATE TABLE aspire_chatbot_message (
    id SERIAL PRIMARY KEY,
    chatbot_id INT NOT NULL,
    message VARCHAR(10000) NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_aspire_chatbot_message_chatbot_id 
      FOREIGN KEY (chatbot_id) REFERENCES aspire_chatbot_list (id) 
        ON UPDATE CASCADE 
        ON DELETE SET NULL
);

CREATE TABLE aspire_task (
    id SERIAL PRIMARY KEY,
    prompt VARCHAR(1024) NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_aspire_task_user_id 
      FOREIGN KEY (user_id) REFERENCES aspire_user (id) 
      ON UPDATE CASCADE 
      ON DELETE SET NULL
);

CREATE TABLE aspire_task_description (
    id SERIAL PRIMARY KEY,
    task_id INT NOT NULL,
    step VARCHAR(8192) NOT NULL,
    done BOOLEAN NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_aspire_task_description_task_id 
      FOREIGN KEY (task_id) REFERENCES aspire_task (id) 
        ON UPDATE CASCADE 
        ON DELETE SET NULL
);

CREATE TABLE aspire_story (
    id SERIAL PRIMARY KEY,
    prompt VARCHAR(1024) NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_aspire_story_user_id 
      FOREIGN KEY (user_id) REFERENCES aspire_user (id) 
      ON UPDATE CASCADE 
      ON DELETE SET NULL
);

CREATE TABLE aspire_story_description (
    id SERIAL PRIMARY KEY,
    story_id INT NOT NULL,
    title VARCHAR(64) NOT NULL,
    description VARCHAR(8192) NOT NULL,
    image BYTEA NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_aspire_story_description_story_id 
      FOREIGN KEY (story_id) REFERENCES aspire_story (id) 
        ON UPDATE CASCADE 
        ON DELETE SET NULL
);