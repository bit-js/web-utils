import { bufferToBase64URL } from '../utils';

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
    public id!: string;
    public authorizeEndpoint!: string;
    public tokenEndpoint!: string;

    public scopes?: string[];
    public redirectURI?: string;
    public codeVerifier?: string;
    public authenticateWith?: 'http_basic_auth' | 'request_body';
}

// Client
const textEncoder = new TextEncoder();

export class Client extends ClientOptions {
    public constructor(options: ClientOptions) {
        super();

        this.id = options.id;
        this.authorizeEndpoint = options.authorizeEndpoint;
        this.tokenEndpoint = options.tokenEndpoint;

        this.scopes = options.scopes;
        this.redirectURI = options.redirectURI;
        this.authenticateWith = options.authenticateWith;
        this.codeVerifier = options.codeVerifier;
    }

    public async createAuthorizationURL(options?: {
        state?: string,
        codeChallengeMethod?: 'S256' | 'plain'
    }): Promise<URL> {
        const authorizationUrl = new URL(this.authorizeEndpoint);
        const { searchParams } = authorizationUrl;

        searchParams.set('response_type', 'code');
        searchParams.set('client_id', this.id);

        if (this.redirectURI !== undefined)
            searchParams.set('redirect_uri', this.redirectURI);

        if (options !== undefined) {
            const { scopes } = this;
            if (scopes !== undefined && scopes.length !== 0)
                searchParams.set('scope', scopes.join(' '));

            if (options.state !== undefined)
                searchParams.set('state', options.state);

            if (this.codeVerifier !== undefined) {
                const { codeChallengeMethod } = options;

                searchParams.set('code_challenge_method', codeChallengeMethod ?? 'S256');
                searchParams.set('code_challenge', codeChallengeMethod === undefined || codeChallengeMethod === 'S256'
                    ? bufferToBase64URL(await crypto.subtle.digest('SHA-256', textEncoder.encode(this.codeVerifier)))
                    : this.codeVerifier);
            }
        }

        return authorizationUrl;
    }

    // eslint-disable-next-line
    public validateAuthorizationCode(
        authorizationCode: string,
        credentials?: string
    ): Promise<TokenResult> {
        const body = new URLSearchParams();
        body.set('code', authorizationCode);
        body.set('client_id', this.id);
        body.set('grant_type', 'authorization_code');

        if (this.redirectURI !== undefined)
            body.set('redirect_uri', this.redirectURI);

        if (this.codeVerifier !== undefined)
            body.set('code_verifier', this.codeVerifier);

        return this.sendTokenRequest(body, credentials);
    }

    // eslint-disable-next-line
    public refreshAccessToken(
        refreshToken: string,
        credentials?: string
    ): Promise<TokenResult> {
        const body = new URLSearchParams();
        body.set('refresh_token', refreshToken);
        body.set('client_id', this.id);
        body.set('grant_type', 'refresh_token');

        const { scopes } = this; // remove duplicates
        if (scopes !== undefined && scopes.length !== 0)
            body.set('scope', scopes.join(' '));

        return this.sendTokenRequest(body, credentials);
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

export function generateState(): string {
    crypto.getRandomValues(store);
    return bufferToBase64URL(store);
}

export const generateCodeVerifier = generateState;
