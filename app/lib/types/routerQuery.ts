

export interface RouterQuery<T>{
    queries : Query<T>[]
}

interface Query<T>{
    key : keyof T,
    value : string | number |boolean | string[] | null,
    operator : "<" | "<=" | "==" | "!=" | ">=" | ">" | "array-contains" | "in" | "not-in" | "array-contains-any",
    replacable ? : boolean;
}



export interface PaginatedQuery<T> extends RouterQuery<T>{
    startAfter ? : string;
    limit ? : number;
    defaultQueries ?: Query<T>[];
    orderBy ? : keyof T;
    defultOrderBy ? : keyof T;
    hasMore ? : boolean
}