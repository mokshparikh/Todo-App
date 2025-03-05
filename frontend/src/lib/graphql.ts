// Register mutation
export const REGISTER_USER = `
  mutation RegisterUser(
    $email: String!
    $password: String!
    $username: String!
  ) {
    register(email: $email, password: $password, username: $username) {
      id
      email
      username
      password
    }
  }
`;

export interface RegisterUserResponse {
  register: {
    id: string;
    email: string;
    username: string;
    password: string;
  };
}

export interface RegisterUserVariables {
  email: string;
  password: string;
  username: string;
}

// Login mutation
export const LOGIN_USER = `
  mutation LoginUser($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

export interface LoginUserResponse {
  login: string;
}

export interface LoginUserVariables {
  email: string;
  password: string;
}

// Add Todo mutation
export const addTodoMut = `
  mutation addTodo(
    $title: String!
    $description: String!
    $completed: Boolean!
    $token: String!
  ) {
    addTodo(
      title: $title
      description: $description
      completed: $completed
      token: $token
    ) {
      id
      title
      description
      createdAt
    }
  }
`;

export interface AddTodoResponse {
  addTodo: {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
    userId: number;
  };
}

export interface AddTodoVariables {
  title: string;
  description: string;
  completed?: boolean;
  token: string;
}

// all Todo data
export const GET_USER_TODOS = `
  query GetUserTodos($userId: String!) {
    getUserTodos(userId: $userId) {
      id
      title
      description
      completed
      createdAt
    }
  }
`;

export interface GetUserTodosResponse {
  getUserTodos: {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    createdAt: string;
  }[];
}

export interface GetUserTodosVariables {
  userId: string;
}

// Delete Todo mutation
export const DELETE_TODO = `
  mutation DeleteTodo($id: Int!, $token: String!) {
    deleteTodo(id: $id, token: $token)
  }
`;

export interface DeleteTodoResponse {
  deleteTodo: boolean;
}

export interface DeleteTodoVariables {
  id: number;
  token: string;
}

// Edit Todo mutation
export const EDIT_TODO = `
  mutation EditTodo(
    $id: Int!
    $token: String!
    $title: String
    $description: String
    $completed: Boolean
  ) {
    editTodo(
      id: $id
      token: $token
      title: $title
      description: $description
      completed: $completed
    ) {
      id
      title
      description
      completed
      updatedAt
    }
  }
`;

export interface EditTodoResponse {
  editTodo: {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    updatedAt: string;
  };
}

export interface EditTodoVariables {
  id: number;
  token: string;
  title?: string;
  description?: string;
  completed?: boolean;
  createdAt?: string;
}

// Get Todo by ID query
export const GET_TODO_BY_ID = `
  query GetTodoById($id: Int!) {
    getTodoById(id: $id) {
      id
      title
      description
      completed
      createdAt
      updatedAt
    }
  }
`;

export interface GetTodoByIdResponse {
  getTodoById: {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export interface GetTodoByIdVariables {
  id: number;
}
