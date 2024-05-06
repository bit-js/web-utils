import { base64url } from './encode';

// Token response
export interface TokenResponse {
    // eslint-disable-next-line
    access_token: string;
    // eslint-disable-next-line
    token_type?: string;
    // eslint-disable-next-line
    expires_in?: number;
    // eslint-disable-next-line
    refresh_token?: string;

    scope?: string;
}

export interface TokenErrorResponse {
    error: string;
    // eslint-disable-next-line
    error_description?: string;
}

export type TokenResult = TokenErrorResponse | TokenResponse;

const genericError: TokenErrorResponse = { error: 'Authentication failed' };
function yieldError(): TokenErrorResponse {
    return genericError;
}
function toTokenResult(res: Response): Promise<TokenResult> | TokenResult {
    return res.ok ? res.json().catch(yieldError) : genericError;
}

// Options
export class ClientOptions {
    public readonly id!: string;
    public readonly authorizeEndpoint!: string;
    public readonly tokenEndpoint!: string;
    public readonly redirectURI?: string;
    public readonly authenticateWith?: 'http_basic_auth' | 'request_body';
}

// Client
const textEncoder = new TextEncoder();

export class Client extends ClientOptions {
    public constructor(options: ClientOptions) {
        super();
        // @ts-expect-error Prop assign
        this.id = options.id;
        // @ts-expect-error Prop assign
        this.authorizeEndpoint = options.authorizeEndpoint;
        // @ts-expect-error Prop assign
        this.tokenEndpoint = options.tokenEndpoint;
        // @ts-expect-error Prop assign
        this.redirectURI = options.redirectURI;
        // @ts-expect-error Prop assign
        this.authenticateWith = options.authenticateWith;
    }

    public async createAuthorizationURL(options?: {
        state?: string,
        codeVerifier?: string,
        codeChallengeMethod?: 'S256' | 'plain',
        scopes?: string[]
    }): Promise<URL> {
        const authorizationUrl = new URL(this.authorizeEndpoint);
        const { searchParams } = authorizationUrl;

        searchParams.set('response_type', 'code');
        searchParams.set('client_id', this.id);

        if (this.redirectURI !== undefined)
            searchParams.set('redirect_uri', this.redirectURI);

        if (options !== undefined) {
            const { scopes } = options;
            if (scopes !== undefined && scopes.length !== 0)
                searchParams.set('scope', scopes.join(' '));

            if (options.state !== undefined)
                searchParams.set('state', options.state);

            if (options.codeVerifier !== undefined) {
                const { codeChallengeMethod } = options;

                searchParams.set('code_challenge_method', codeChallengeMethod ?? 'S256');
                searchParams.set('code_challenge', codeChallengeMethod === undefined || codeChallengeMethod === 'S256'
                    ? base64url(new Uint8Array(await crypto.subtle.digest('SHA-256', textEncoder.encode(options.codeVerifier))))
                    : options.codeVerifier);
            }
        }

        return authorizationUrl;
    }

    public async validateAuthorizationCode(
        authorizationCode: string,
        options?: {
            credentials?: string,
            codeVerifier?: string
        }
    ): Promise<TokenResult> {
        const body = new URLSearchParams();
        body.set('code', authorizationCode);
        body.set('client_id', this.id);
        body.set('grant_type', 'authorization_code');

        if (this.redirectURI !== undefined)
            body.set('redirect_uri', this.redirectURI);

        if (options?.codeVerifier !== undefined)
            body.set('code_verifier', options.codeVerifier);

        return this.sendTokenRequest(body, options?.credentials);
    }

    public async refreshAccessToken(
        refreshToken: string,
        options?: {
            credentials?: string,
            scopes?: string[]
        }
    ): Promise<TokenResult> {
        const body = new URLSearchParams();
        body.set('refresh_token', refreshToken);
        body.set('client_id', this.id);
        body.set('grant_type', 'refresh_token');

        const scopes = options?.scopes ?? []; // remove duplicates
        if (scopes.length !== 0)
            body.set('scope', scopes.join(' '));

        return this.sendTokenRequest(body, options?.credentials);
    }

    // eslint-disable-next-line
    public sendTokenRequest(
        body: URLSearchParams,
        credentials?: string
    ): Promise<TokenResult> {
        const headers = {
            // eslint-disable-next-line
            'Content-Type': 'application/x-www-form-urlencoded',
            // eslint-disable-next-line
            'Accept': 'application/json'
        };

        if (credentials !== undefined) {
            const { authenticateWith } = this;

            if (authenticateWith === undefined || authenticateWith === 'http_basic_auth')
                // @ts-expect-error Add more props to the header
                // eslint-disable-next-line
                headers.Authorization = 'Basic ' + btoa(`${this.id}:${credentials}`);

            else body.set('client_secret', credentials);
        }

        return fetch(this.tokenEndpoint, { method: 'POST', headers, body }).then(toTokenResult);
    }
}

// Utils
const store = new Uint8Array(32);

export function createState(): string {
    crypto.getRandomValues(store);
    return base64url(store);
}

export const createVerifier = createState;
