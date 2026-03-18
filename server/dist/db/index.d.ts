export declare function initDatabase(): Promise<void>;
export declare function saveDatabase(): void;
export declare function query<T = any>(sql: string, params?: any[]): T[];
export declare function queryOne<T = any>(sql: string, params?: any[]): T | null;
export declare function run(sql: string, params?: any[]): {
    changes: number;
    lastInsertRowId: number;
};
declare const _default: {
    initDatabase: typeof initDatabase;
    query: typeof query;
    queryOne: typeof queryOne;
    run: typeof run;
    saveDatabase: typeof saveDatabase;
};
export default _default;
