import React, { FunctionComponent } from 'react'
import styled from 'styled-components'

interface Props {
    tableString: string
}

const ArticleTable: FunctionComponent<Props> = ({ tableString }) => {

    const headCaretStart = '%head'
    const headCaretEnd = 'head%'

    const extractHeadCells = () => {

        return tableString.substring(
            tableString.lastIndexOf(headCaretStart) + 1,
            tableString.lastIndexOf(headCaretEnd)
        ).split(',').map(s => s.trim())
    }
    const headCells = extractHeadCells()

    return (
        <TableStyleProvider>
            <table>
                <tbody>
                    <tr>
                        <th>Company</th>
                        <th>Contact</th>
                        <th>Country</th>
                    </tr>
                    <tr>
                        <td>Alfreds Futterkiste</td>
                        <td>Maria Anders</td>
                        <td>Germany</td>
                    </tr>
                    <tr>
                        <td>Berglunds snabbköp</td>
                        <td>Christina Berglund</td>
                        <td>Sweden</td>
                    </tr>
                    <tr>
                        <td>Centro comercial Moctezuma</td>
                        <td>Francisco Chang</td>
                        <td>Mexico</td>
                    </tr>
                    <tr>
                        <td>Ernst Handel</td>
                        <td>Roland Mendel</td>
                        <td>Austria</td>
                    </tr>
                    <tr>
                        <td>Island Trading</td>
                        <td>Helen Bennett</td>
                        <td>UK</td>
                    </tr>
                    <tr>
                        <td>Königlich Essen</td>
                        <td>Philip Cramer</td>
                        <td>Germany</td>
                    </tr>
                    <tr>
                        <td>Laughing Bacchus Winecellars</td>
                        <td>Yoshi Tannamuri</td>
                        <td>Canada</td>
                    </tr>
                    <tr>
                        <td>Magazzini Alimentari Riuniti</td>
                        <td>Giovanni Rovelli</td>
                        <td>Italy</td>
                    </tr>
                    <tr>
                        <td>North/South</td>
                        <td>Simon Crowther</td>
                        <td>UK</td>
                    </tr>
                    <tr>
                        <td>Paris spécialités</td>
                        <td>Marie Bertrand</td>
                        <td>France</td>
                    </tr>
                </tbody>

            </table>
        </TableStyleProvider>
    )
}

const TableStyleProvider = styled.div`

    table{
        border-collapse: collapse;
        width : 100%;
    }

    td,th {
        border: 1px solid #ddd;
        padding: 12px;
    }

    tr:nth-child(even){background-color: #f2f2f2;}  
    tr:hover {background-color: #ddd;}

    th {
        padding-top: 12px;
        padding-bottom: 12px;
        text-align: left;
        background-color: ${(props) => props.theme.colors.primary};;
        color: white;
        font-weight : bold;
    }
`

export default ArticleTable
