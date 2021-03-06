#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import pandas as pd
import numpy as np
from math import sqrt
from numpy import random
from sklearn.metrics import mean_squared_error

COLUMN_USERID = "userId"
COLUMN_MOVIEID = "itemId"
COLUMN_RATING = "rating"
COLUMN_TIMESTAMP = "timestamp"

TRAIN_COLUMNS = [COLUMN_USERID, COLUMN_MOVIEID,
                 COLUMN_RATING, COLUMN_TIMESTAMP]
MOVIES_COLUMNS = ["movieId", "title", "genre"]

DATA_PATH = "../../data/ml-latest-small/"
RATINGS_PATH = "converter/rating_to_database.csv"
SEPERATOR = ","
OUTPUT_PATH = "similar-users.json"
N_USER = -1
N_MOVIE = -1
N_RECOMMENDATIONS = 5


def init_data():
    global N_USER, N_MOVIE
    train_data = pd.read_table(DATA_PATH + RATINGS_PATH,
                               sep=SEPERATOR, header=None, names=TRAIN_COLUMNS, skiprows=[0]).astype({COLUMN_USERID: np.float, COLUMN_MOVIEID: np.float, COLUMN_RATING: np.float}).astype({COLUMN_USERID: int, COLUMN_MOVIEID: int, COLUMN_RATING: np.float})

    train_data.drop([COLUMN_TIMESTAMP], inplace=True, axis=1)
    N_USER = train_data.userId.max()
    N_MOVIE = train_data.itemId.max()

    rating = np.zeros((N_USER, N_MOVIE))
    for row in train_data.itertuples():
        rating[row[1] - 1, row[2] - 1] = row[3]

    train_matrix = np.copy(rating)
    return train_matrix


def cosine_sim(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))


def adj_cosine_sim(train_data):
    sims = np.zeros((N_USER, N_USER))

    movie_mean = train_data.sum(axis=0)/(train_data != 0).sum(axis=0)

    sub_ratings = np.where(
        (train_data != 0), train_data - movie_mean[None, :], train_data)
    for i in range(N_USER):
        for j in range(i, N_USER):
            sim = cosine_sim(sub_ratings[i], sub_ratings[j])
            sims[i, j] = sim
            sims[j, i] = sim

    return sims


def similarities(train_matrix):
    sim_matrix = adj_cosine_sim(train_matrix)
    sim_matrix = np.where((sim_matrix < 0), 0, sim_matrix)
    return sim_matrix


def get_similar_users(sim, user_id):
    users = np.argsort(-sim[user_id])[:N_RECOMMENDATIONS]

    return users


def wrtie_to_file(sim):
    output_file_name = DATA_PATH + OUTPUT_PATH
    with open(output_file_name, 'w') as file:
        file.write("{\n")

        for i in range(N_USER):
            similar_users = get_similar_users(sim, i)
            id_added = similar_users + 1
            new_line = f'\t"{i + 1}": {id_added.tolist()},\n'
            file.write(new_line)

        file.write("}")
    return


if __name__ == "__main__":
    train = init_data()
    print(f'done init data')
    sim = similarities(train)
    print(f'done sim')
    wrtie_to_file(sim)
    print("DONE!")
