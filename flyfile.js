export default async function () {
    await this.watch('src/**/*.js', ['build']);
}

export async function build () {
    await this.clear('dist');
    await this.source('src/**/*.js')
    .babel({ sourceMaps: true })
    .target('dist');
}
