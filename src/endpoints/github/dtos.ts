export interface GithubRepoDto {
    name: string;
    owner: {
        login: string;
    };
    html_url: string;
    description: string;
    stargazers_count: number;
}
