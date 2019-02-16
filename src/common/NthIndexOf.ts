export default function nthIndexOf(
    value: string,
    searchString: string,
    nth: number = 1):
    number
{
    let index = value.indexOf(searchString);

    for (let i = 1; i < nth; i++)
    {
        index = value.indexOf(
            searchString,
            index + 1);
    }

    return index;
}