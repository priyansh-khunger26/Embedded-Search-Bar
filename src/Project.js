import axios from "axios";
import * as React from 'react';
import qs from 'qs'
import Grid from "@mui/material/Grid";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { useState } from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import Paper from "@mui/material/Paper";
import TableHead from "@mui/material/TableHead";
import Table from "@mui/material/Table";

const Project = (props) => {

    const [query, setquery] = useState([]);
    const [users, setUsers] = useState([]);

    const onChangequery = (event) => {
        setquery(event.target.value);
    };


    const onSubmit = (event) => {
        event.preventDefault();

        const login_user = {
            grant_type: "",
            username: "dass@subtl.ai",
            password: "Dass@2022",
            scope: "",
            client_id: "",
            client_secret: ""
        };

        axios({
            method: 'post',
            url: 'https://test.subtl.ai/api/auth/login',
            data: qs.stringify(login_user),
            headers: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            }
        }).then(response => {
            const access_token = response.data.access_token;
            console.log(access_token);
            return axios({
                method: 'get',
                url: 'https://test.subtl.ai/api/companies',
                headers: {
                    'Authorization': `Bearer ${access_token}`,

                }
            }).then(response2 => {
                console.log("Response obtained after getting company is...")
                console.log(response2.data);
                const id = response2.data.global_group;
                const transaction_user = {
                    "query_string": query,
                    "target_id": id,
                    "internal_query": false
                };

                return axios({
                    method: 'post',
                    url: 'https://test.subtl.ai/api/transactions',
                    data: JSON.stringify(transaction_user),
                    headers: {
                        'Authorization': `Bearer ${access_token}`,
                        'content-type': "application/json"
                    }

                }).then(response3 => {
                    console.log("Response obtained after transaction is...")
                    console.log(response3.data);
                    setUsers(response3.data.answers);

                })
                    .catch((errorr) => {
                        console.log("We got an error with the transaction!!")
                        console.log(errorr);
                    });

            })
                .catch((errorr) => {
                    console.log("We got an error with company in!!")
                    console.log(errorr);
                });
        })
            .catch((error) => {
                console.log("We got an error while logging in!!")
                console.log(error);
            });
    };

    return (
        <div>
            <div className="container">
                <div container align={"center"}>
                    <h1>Welcome to Project Page!!</h1>
                </div>
                <div className="container">
                    <Grid container>
                        <Grid item xs={12} md={9} lg={9}>
                            <div container align={"center"}>
                                <TextField
                                    id="standard-basic"
                                    label="Search"
                                    value={query}
                                    onChange={onChangequery}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment>
                                                <IconButton onClick={onSubmit}>
                                                    <SearchIcon />
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </div>
                            <div container align={"center"}>

                                <Grid item xs={12} md={9} lg={9}>
                                    <div container align={"center"}>

                                        <Paper>
                                            <Table size="small">                                                
                                                <TableBody>
                                                    {users.map((user, ind) => (
                                                        <TableRow key={ind}>
                                                            <TableCell>{ind + 1}</TableCell>
                                                            <TableCell>{user.answer}</TableCell>

                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </Paper>
                                    </div>
                                </Grid>

                            </div>


                        </Grid>
                    </Grid>
                </div>

            </div>
        </div >
    );

};

export default Project;
