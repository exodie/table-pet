/// <reference types="vite/client" />

declare global {
    type PostsProps = {
        postId: number;
        id: number;
        name: string;
        email: string;
        body: string;
    }

    type ColumnsProps = {
        title: string;
        dataIndex: string;
        key: string;
        isEdit?: boolean;
        render?: (...args: any) => JSX.Element | null;
        sorter?: (...args: any) => number;
        sortOrder?: string | any;
    }

    type SortedProps = {
        columnKey: string;
        field?: string;
        order: string;
    }
}

export { }